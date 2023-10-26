import { Request,Response,NextFunction } from "express";
import {CreateVendorInput} from '../dto'
import { Vendor } from "../models";
import { GeneratePassword, GenerateSalt } from "../utility";

export const findVendor = async(id:string|undefined,email?:string) =>{
    if(email) {
        return await Vendor.findOne({email:email})
    } else {
        return await Vendor.findById(id)
    }
}

export const CreateVendor = async(req:Request,res:Response,next:NextFunction) => {
    const {name,ownerName,foodType,pincode,address,phone,email,password} = <CreateVendorInput>req.body
    // check vendor exits
    const exitsVendor = await Vendor.findOne({email:email})
    if(exitsVendor) {
        return res.status(400).json({"message":"vendor already register with this email"})
    }

    // gen salt
    const salt = await GenerateSalt()
    const userPassword = await GeneratePassword(password,salt)
    const createVendor = await Vendor.create({
        name:name,
        ownerName:ownerName,
        foodType:foodType,
        pincode:pincode,
        address:address,
        phone:phone,
        email:email,
        password:userPassword,
        salt:salt,
        rating:0,
        serviceAvialable:false,
        converImages:[],
        foods:[]
    })
    return res.status(200).json(createVendor)
}

export const GetVendors = async(req:Request,res:Response,next:NextFunction) => {
    const vendors = await Vendor.find()
    if(vendors !== null) {
        return res.status(200).json(vendors)
    }
    return res.status(204).json({"message":"vendors not avialable"})
}

export const GetVendorById = async(req:Request,res:Response,next:NextFunction) => {
    const {id} = req.params
    const vendor = await Vendor.findById(id)
    if(vendor !== null) {
        console.log('in found')
        return res.status(200).json(vendor)
    }
    return res.status(404).json({"message":"vendor not found"})
}