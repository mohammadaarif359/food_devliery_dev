import express, { Request, Response, NextFunction } from 'express'
import { AddFood, GetFood, GetVendorProfile, UpdateVendorCoverImage, UpdateVendorProfile, UpdateVendorService, VendorLogin } from '../controllers';
import { Authenticate } from '../middlewares';
import { AuthPayload } from '../dto/Auth.dto';
import multer from 'multer';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
      interface Request {
        user: AuthPayload
      }
    }
  }

const router = express.Router();

// multer image storage set
const imageStorage = multer.diskStorage({
  destination:function(req,file,cb) {
    cb(null,'images')
  },
  filename:function(req,file,cb) {
    cb(null,new Date().toISOString().replace(/:/g, '-')+''+file.originalname)
  }
})
// image fields name
const images = multer({storage:imageStorage}).array('images',10)

// login
router.post('/login',VendorLogin)
// set authenticate middlware
router.use(Authenticate)
// profile get
router.get('/profile', GetVendorProfile)
// profile update
router.patch('/profile', UpdateVendorProfile)
// servie update
router.patch('/service', UpdateVendorService)
// cover image update
router.patch('/coverimage', images, UpdateVendorCoverImage)

// food
router.post('/food', images, AddFood)
router.get('/foods', GetFood)

// get
router.get('/',(req:Request, res:Response, next:NextFunction) => {
    res.json({"msg":"hello vendor route"});
})

export { router as VendorRoute };