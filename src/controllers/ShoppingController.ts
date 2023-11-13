import { Request,Response,NextFunction } from "express";
import { FoodDoc, Offer, Vendor } from "../models";
import { GET_AYSNC, SET_AYSNC } from "../services/redisClient";

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
    const {rating,name} = req.query
    const result = await GET_AYSNC(`top_resutants:${pincode}&name=${name}&rating=${rating}`)
    if(result) {
        console.log('already cache',pincode,name,rating)
        return res.status(200).json(JSON.parse(result))
    } else {
        const query: { pincode: string; serviceAvialable: boolean; name?: string; rating?: Number } =  {
            pincode:pincode,serviceAvialable:true
        };
        if(name){
            query.name = String(name)
        }
        if(rating){
            query.rating = Number(rating)
        }
        const result = await Vendor.find(query)
            .sort([['rating','descending']])
            .limit(10)       
    
        if(result.length > 0) {
            const responseCahce = await SET_AYSNC(`top_resutants:${pincode}&name=${name}&rating=${rating}`,JSON.stringify(result),'EX',300000)
            console.log('new cache',pincode,name,rating)
            return res.status(200).json(result)
        }
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

export const GetAvialableOffers = async(req:Request,res:Response,next:NextFunction) => {
    const pincode = req.params.pincode
    const result = await GET_AYSNC(`available_offers:{$pincode}`)
    if(result) {
        return res.status(200).json(JSON.parse(result));
    } else {
        const offers = await Offer.find({pincode:pincode,isActive:true})
        if(offers) {
            const cacheResult = await SET_AYSNC(`available_offers:{$pincode}`,JSON.stringify(offers),'EX',300000)
            return res.status(200).json(offers);
        }
    }
    return res.status(400).json({"message":"Offers not found"})
}    