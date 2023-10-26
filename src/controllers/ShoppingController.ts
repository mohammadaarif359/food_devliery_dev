import { Request,Response,NextFunction } from "express";
import { FoodDoc, Vendor } from "../models";

export const GetFoodAvailibility = async(req:Request,res:Response,next:NextFunction) => {
    const pincode = req.params.pincode;
    const result = await Vendor.find({pincode:pincode,serviceAvialable:true})
        .sort([['rating','descending']])
        .populate('foods')

    if(result.length > 0) {
        return res.status(200).json(result)
    }  
    return res.status(400).json({"message":"Data not found"})      
}

export const GetTopResturant = async(req:Request,res:Response,next:NextFunction) => {
    const pincode = req.params.pincode;
    const result = await Vendor.find({pincode:pincode,serviceAvialable:true})
        .sort([['rating','descending']])
        .limit(10)
    
    if(result.length > 0) {
        return res.status(200).json(result)
    }  
    return res.status(400).json({"message":"Data not found"}) 
}

export const GetFoodIn30Min = async(req:Request,res:Response,next:NextFunction) => {
    const pincode = req.params.pincode;
    const result = await Vendor.find({pincode:pincode,serviceAvialable:true}).populate('foods')
    
    if(result.length > 0) {
        let foodResult:any = []
        result.map(vendor=>{
            const foods = vendor.foods as [FoodDoc]
            foodResult.push(...foods.filter(food => food.readyTime <= 30))
        })
        return res.status(200).json(foodResult)
    }  
    return res.status(400).json({"message":"Data not found"})
}

export const SearchFood = async(req:Request,res:Response,next:NextFunction) => {
    const pincode = req.params.pincode;
    const result = await Vendor.find({pincode:pincode,serviceAvialable:true}).populate('foods')
    
    if(result.length > 0) {
        let foodResult:any = []
        result.map(item=> foodResult.push(...item.foods) )
        return res.status(200).json(foodResult)
    }  
    return res.status(400).json({"message":"Data not found"})
}

export const GetResturantById = async(req:Request,res:Response,next:NextFunction) => {
    const id = req.params.id;
    const result = await Vendor.findById(id).populate('foods')
    if(result) {
        return res.status(200).json(result)
    }  
    return res.status(400).json({"message":"Data not found"})      
}