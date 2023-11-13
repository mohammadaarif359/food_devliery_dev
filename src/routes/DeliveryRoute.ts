import express, { Request, Response, NextFunction } from 'express'
import { DeliveryUserLogin, DeliveryUserServiceStatus, DeliveryUserSingUp, GetDeliveryUserProfile, UpdateDeliveryUserProfile } from '../controllers';
import { Authenticate } from '../middlewares';

const router = express.Router();
// customer
// singup
router.post('/signup', DeliveryUserSingUp)
// login
router.post('/login', DeliveryUserLogin)
// authenticate
router.use(Authenticate);
// change service status
router.put('/service-status', DeliveryUserServiceStatus)
// profole get
router.get('/profile', GetDeliveryUserProfile)
// profile update
router.patch('/profile', UpdateDeliveryUserProfile)

export { router as DeliveryRoute };