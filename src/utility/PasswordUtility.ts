import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { VendorPayload } from "../dto";
import { JWT_SECRET } from "../config";
import { AuthPayload } from "../dto/Auth.dto";

export const GenerateSalt = async() => {
    return await bcrypt.genSalt();
}

export const GeneratePassword = async(password:string,salt:string) => {
    return await bcrypt.hash(password,salt);
}

export const ValidatePassword = async(enteredPassword:string,savedPassword:string,salt:string) => {
    return await GeneratePassword(enteredPassword,salt) == savedPassword
}

export const GenerateToken = async(payload:AuthPayload) =>{
    return jwt.sign(payload,JWT_SECRET,{
        expiresIn:'1d'
    })
}