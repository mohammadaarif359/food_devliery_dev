import { Request,Response,NextFunction } from "express";
import { plainToClass } from 'class-transformer'
import { validate } from "class-validator";
import {  GeneratePassword, GenerateSalt, GenerateToken, ValidatePassword } from "../utility";
import { DeliveryUser } from "../models";
import { CreateDevlieryUserInput, DeliveryLoginInput, UpdateDeliveryInput } from "../dto";

export const DeliveryUserSingUp = async(req:Request,res:Response,next:NextFunction) => {
    const devlieryInputs = plainToClass(CreateDevlieryUserInput,req.body)
    const inputErrors = await validate(devlieryInputs, {validationError:{target:true}})
    if(inputErrors.length > 0) {
        return res.status(400).json(inputErrors)
    }

    const { email,phone,password,firstName,lastName,address,pincode } = devlieryInputs

    const exitsingUser = await DeliveryUser.findOne({email:email})
    if(exitsingUser) {
        return res.status(400).json({"message":"An user already exits with this email"})
    }

    const salt = await GenerateSalt();
    const userPassowrd = await GeneratePassword(password,salt)

    const result = await DeliveryUser.create({
        firstName,
        lastName,
        email,
        phone,
        password:userPassowrd,
        salt,
        address,
        pincode,
        lat:0,
        lng:0,
        verified:false,
        isActive:false
    })
    if(result) {
        // send otp
        // await onRequestOtp(otp,phone)
        // generate token
        const token = await GenerateToken({
            _id:result.id,
            email:result.email,
            verified:result.verified
        })

        // return result
        return res.status(200).json({email:result.email,verified:result.verified,token})
    }
    return res.status(500).json({"message":"something went wrong"})
}

export const DeliveryUserLogin = async(req:Request,res:Response,next:NextFunction) => {
    const loginInputs = plainToClass(DeliveryLoginInput,req.body)
    const inputErrors = await validate(loginInputs, {validationError:{target:true}})
    if(inputErrors.length > 0) {
        return res.status(400).json(inputErrors)
    }

    const {email,password} = loginInputs
    const result = await DeliveryUser.findOne({email:email}) 
    if(result) {
        const verifyPassword = await ValidatePassword(password,result.password,result.salt)
        if(verifyPassword) {
            const token = await GenerateToken({
                _id:result.id,
                email:result.email,
                verified:result.verified
            }) 

            return res.status(200).json({email:result.email,verified:result.verified,token})
        } else {
            return res.status(400).json({"message":"invalid email"})
        }
    } else {
        return res.status(400).json({"message":"invalid password"})
    }
}

export const GetDeliveryUserProfile = async(req:Request,res:Response,next:NextFunction) => {
    const user = req.user
    if(user) {
        const deliveryUser = await DeliveryUser.findById(user._id)
        return res.status(200).json(deliveryUser)
    } else {
        return res.status(400).json({"message":"data not found"})
    }
}

export const UpdateDeliveryUserProfile = async(req:Request,res:Response,next:NextFunction) => {
    const user = req.user
    /* const deliveryInputs = plainToClass(UpdateDeliveryInput,req.body)
    const inputErrors = await validate(deliveryInputs, {validationError:{target:true}})
    if(inputErrors.length > 0) {
        return res.status(400).json(inputErrors)
    } */
    
    const deilverUser = await DeliveryUser.findById(user._id)
    if(deilverUser) {
        const {firstName,lastName,address} = req.body
        deilverUser.firstName = firstName
        deilverUser.lastName = lastName
        deilverUser.address = address
        const result = await deilverUser.save();
        return res.status(200).json(result)
    } else {
        return res.status(400).json({'message':"deilver user not found"})
    }
}    

export const DeliveryUserServiceStatus = async(req:Request,res:Response,next:NextFunction) => {
    const user = req.user
    if(user) {
        const {lat,lng,isActive} = req.body
        const deliveryUser = await DeliveryUser.findById(user._id)
        if(deliveryUser) {
            if(lat && lng) {
                deliveryUser.lat = lat
                deliveryUser.lng = lng
            }
            
            deliveryUser.isActive = isActive
            const result  = await deliveryUser.save();
            return res.status(200).json(result)
        }
    }    
    return res.status(400).json({"message":"data not found"})
}   