import { JWT_SECRET } from "../config";
import { AuthPayload } from "../dto/Auth.dto";
import { Request,Response,NextFunction } from "express";
import jwt from "jsonwebtoken"

export const Authenticate = async (req: Request, res: Response, next: NextFunction) => {
    if(req.headers.authorization){
        try {
            const token = req.headers?.authorization.split(" ")[1]
            const payload = await jwt.verify(token, JWT_SECRET) as AuthPayload; 
            req.user = payload;
            next();

        } catch(err){
            return res.status(401).json({"message":"Unauthorzied"})
        } 
    } else {
        return res.status(401).json({"message":"Unauthorzied"})
    }
}