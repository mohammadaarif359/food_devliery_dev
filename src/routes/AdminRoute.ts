import express, { Request, Response, NextFunction } from 'express'
import { CreateVendor, GetVendorById, GetVendors, DeliveryUserVerify, GetDeliveryUsers } from '../controllers';

const router = express.Router();
// create-vendor
router.post('/vendor', CreateVendor)
// get-vendors
router.get('/vendors', GetVendors)
// get by id -vendor
router.get('/vendor/:id', GetVendorById)

// delivery -list
router.get('/delivery', GetDeliveryUsers)
// devliery user - verify
router.put('/delivery/verify', DeliveryUserVerify) 
// get
router.get('/',(req:Request, res:Response, next:NextFunction) => {
    res.json({"msg":"hello admin route"});
})

export { router as AdminRoute };