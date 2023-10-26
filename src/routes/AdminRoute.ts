import express, { Request, Response, NextFunction } from 'express'
import { CreateVendor, GetVendorById, GetVendors } from '../controllers';

const router = express.Router();

// create
router.post('/vendor', CreateVendor)
// get
router.get('/vendors', GetVendors)
// get by id
router.get('/vendor/:id', GetVendorById)
// get
router.get('/',(req:Request, res:Response, next:NextFunction) => {
    res.json({"msg":"hello admin route"});
})

export { router as AdminRoute };