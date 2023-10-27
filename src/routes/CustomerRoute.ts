import express, { Request, Response, NextFunction } from 'express'
import { AddCart, CreateOrder, CustomerLogin, CustomerSingUp, CustomerVerify, DeleteCart, GetCart, GetCustomerProfile, GetOrderById, GetOrders, RequestOtp, UpdateCustomerProfile } from '../controllers';
import { Authenticate } from '../middlewares';

const router = express.Router();
// customer signup and profile
/*  signup  */
router.post('/signup', CustomerSingUp)

/*  Login  */
router.post('/login', CustomerLogin)

/* After this all route reuqired authentication */
router.use(Authenticate)

/*  Verify Account  */
router.post('/verify', CustomerVerify)

/*  Otp  */
router.get('/otp', RequestOtp)

/*  Profile get */
router.get('/profile', GetCustomerProfile)
/* Profile update */
router.patch('/profile', UpdateCustomerProfile)

// Carts
/* Add cart */
router.post('/cart', AddCart)

router.get('/cart', GetCart)

router.delete('/cart', DeleteCart)

// Orders
/*  Order create */
router.post('/order', CreateOrder)
/*  Order get */
router.get('/orders', GetOrders)
/*  Order by id */
router.get('/order/:id', GetOrderById)
export { router as CustomerRoute };