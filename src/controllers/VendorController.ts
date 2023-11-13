import { Request, Response, NextFunction } from "express" 
import { CreateOfferInput, EditVendorInput, VendorLoginInput } from "../dto"
import { findVendor } from "./AdminController"
import { GenerateToken, ValidatePassword } from "../utility"
import { Offer, Vendor } from "../models"
import { Food } from "../models"
import { FoodCreateInput } from "../dto/Food.dto"
import { Order } from "../models"

export const VendorLogin  = async(req:Request,res:Response,next:NextFunction) =>{
    const {email,password} = <VendorLoginInput>req.body
    const existingVendor = await findVendor('',email);
    if(existingVendor !== null) {
        const validatePassword = await ValidatePassword(password,existingVendor.password,existingVendor.salt)
        if(validatePassword) {
            const token = await GenerateToken({
                _id:existingVendor.id,
                name:existingVendor.name,
                email:existingVendor.email,
                foodType:existingVendor.foodType
            })
            return res.status(200).json({user:existingVendor,token})
        } else {
            return res.status(400).json({"message":"password inavalid"})
        }
    }
    return res.status(400).json({"message":"email inavalid"})
}
export const GetVendorProfile  = async(req:Request,res:Response,next:NextFunction) => {
    const vendor  = await findVendor(req.user._id)
    if(vendor) {
        return res.status(200).json(vendor)
    } else {
        return res.status(204).json({"message":"vendor not found"})
    }
}

export const UpdateVendorProfile  = async(req:Request,res:Response,next:NextFunction) => {
    const {name,address,phone,foodType} = <EditVendorInput>req.body
    const vendor  = await findVendor(req.user._id)
    if(vendor) {
        vendor.name = name;
        vendor.address = address
        vendor.phone = phone
        vendor.foodType = foodType;
        const updatedVendor = await vendor.save();
        return res.status(200).json(updatedVendor)
    } else {
        return res.status(204).json({"message":"vendor not found"})
    }
}

export const UpdateVendorService  = async(req:Request,res:Response,next:NextFunction) => {
    const {lat,lng} = req.body
    const vendor  = await findVendor(req.user._id)
    if(vendor) {
        vendor.serviceAvialable = !vendor.serviceAvialable;
        if(lat && lng) {
            vendor.lat = lat
            vendor.lng = lng
        }
        const updatedVendor = await vendor.save();
        return res.status(200).json(updatedVendor)
    } else {
        return res.status(204).json({"message":"vendor not found"})
    }
}

export const UpdateVendorCoverImage  = async(req:Request,res:Response,next:NextFunction) => {
    const vendor  = await findVendor(req.user._id)
    if(vendor) {
        // get uploaded files
        const files = req.files as [Express.Multer.File]
        const images = files.map((file:Express.Multer.File)=> file.filename)
        vendor.converImages.push(...images)
        const result = await vendor.save();
        return res.status(200).json(result)
    } else {
        return res.status(204).json({"message":"vendor not found"})
    }
}

export const AddFood  = async(req:Request,res:Response,next:NextFunction) => {
    const {name,description,category,foodType,readyTime,price} = <FoodCreateInput>req.body
    const vendor  = await findVendor(req.user._id)
    if(vendor) {
        // get uploaded files
        const files = req.files as [Express.Multer.File]
        const images = files.map((file:Express.Multer.File)=> file.filename)
        const createFood = await Food.create({
            vendorId:vendor._id,
            name,
            description,
            category,
            foodType,
            readyTime,
            price,
            images:images,
            rating:0
        })
        vendor.foods.push(createFood)
        const result = await vendor.save();
        return res.status(200).json(result)
    } else {
        return res.status(204).json({"message":"vendor not found"})
    }
}

export const GetFood  = async(req:Request,res:Response,next:NextFunction) => {
    const user = req.user
    const foods = await Food.find({vendorId:user._id})
    if(foods) {
        return res.status(200).json(foods)
    } else {
        return res.status(204).json({"message":"vendor not found"})
    }
}

export const GetCurrentOrders = async(req:Request,res:Response,next:NextFunction) => {
    const vendor = req.user;
    if(vendor) {
        const orders = await Order.find({vendorId:vendor._id}).populate('items.food')
        if(orders) {
            return res.status(200).json(orders)
        }
    }
    return res.status(204).json({"message":"orders not found"})
}

export const GetrOrderDeatil = async(req:Request,res:Response,next:NextFunction) => {
    const id = req.params.id;
    console.log('id',id);
    if(id) {
        const order = await Order.findById(id).populate('items.food')
        console.log('order',order)
        if(order) {
            return res.status(200).json(order)
        }
    }
    return res.status(204).json({"message":"order not found"})
}

export const OrderProcess = async(req:Request,res:Response,next:NextFunction) => {
    const id = req.params.id;
    if(id) {
        const { status,remarks,time } = req.body
        const order = await Order.findById(id)
        if(order) {
            order.orderStatus = status
            order.remarks = remarks
            if(time) {
                order.readyTime = time;
            }
            const result = await order.save();
            return res.status(200).json(result)
        }
    }
    return res.status(204).json({"message":"unable to prcoess order"})
}

export const GetOffers = async(req:Request,res:Response,next:NextFunction) => {
    const user = req.user
    if(user) {
        let currentOffers = [];
        const offers = await Offer.find().populate('vendors')
        if(offers) {
            offers.map(offer=>{
                if(offer.vendors) {
                    offer.vendors.map(vendor=>{
                        if(vendor._id.toString() === user._id) {
                            currentOffers.push(offer)
                        }
                    })
                } else if(offer.offerType == 'GENERIC') {
                    currentOffers.push(offer)
                }    
            })
        }
        return res.status(200).json(currentOffers)
    }
    res.status(400).json({"message":"Offers not found"})
}

export const AddOffer = async(req:Request,res:Response,next:NextFunction) => {
    const user = req.user
    if(user) {
        const { offerType,title,description,minValue,offerAmount,startValidity,endValidity,promocode,promoType,bank,bins,pincode,isActive } = <CreateOfferInput>req.body
        const vendor = await Vendor.findById(user._id)
        if(vendor) {
            const offer = await Offer.create({
                vendors:[user._id],
                offerType,
                title,description,
                minValue,
                offerAmount,
                startValidity,
                endValidity,
                promocode,
                promoType,
                bank,
                bins,
                pincode,
                isActive
            })
            return res.status(200).json(offer)
        }
    }
    return res.status(200).json({"message":"vendor not found"})
}

export const UpdateOffer = async(req:Request,res:Response,next:NextFunction) => {
    const user = req.user
    const id = req.params.id
    if(user) {
        const { offerType,title,description,minValue,offerAmount,startValidity,endValidity,promocode,promoType,bank,bins,pincode,isActive } = <CreateOfferInput>req.body
        const offer = await Offer.findById(id)
        const vendor = await Vendor.findById(user._id)
        if(vendor && offer) {
            offer.offerType = offerType;
            offer.title = title,
            offer.description = description;
            offer.minValue = minValue;
            offer.offerAmount = offerAmount
            offer.startValidity = startValidity;
            offer.endValidity = endValidity;
            offer.promocode = promocode;
            offer.promoType = promoType;
            offer.bank = bank;
            offer.bins = bins;
            offer.pincode = pincode;
            offer.isActive = isActive;
            const result = await offer.save();
            return res.status(200).json(result)
        }
    }
    return res.status(200).json({"message":"vendor offer not found"})
}

export const DeleteOffer = async(req:Request,res:Response,next:NextFunction) => {
}