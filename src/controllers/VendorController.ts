import { Request, Response, NextFunction } from "express" 
import { EditVendorInput, VendorLoginInput } from "../dto"
import { findVendor } from "./AdminController"
import { GenerateToken, ValidatePassword } from "../utility"
import { Vendor } from "../models"
import { Food } from "../models"
import { FoodCreateInput } from "../dto/Food.dto"

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
    const {name,address,phone,foodType} = <EditVendorInput>req.body
    const vendor  = await findVendor(req.user._id)
    if(vendor) {
        vendor.serviceAvialable = !vendor.serviceAvialable;
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