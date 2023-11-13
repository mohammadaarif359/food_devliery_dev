import express, { Request, Response, NextFunction } from 'express'
import { AddCart, CreateOrder, CreatePayment, CustomerLogin, CustomerSingUp, CustomerVerify, DeleteCart, GetCart, GetCustomerProfile, GetOrderById, GetOrders, RequestOtp, UpdateCustomerProfile, VerifyOffer } from '../controllers';
import { Authenticate } from '../middlewares';

const router = express.Router();
// customer
// singup
router.post('/signup', CustomerSingUp)
// login
router.post('/login', CustomerLogin)
// authenticate
router.use(Authenticate)
// acount verfify
router.post('/verify', CustomerVerify)
// otp get
router.get('/otp', RequestOtp)
// profole get
router.get('/profile', GetCustomerProfile)
// profile update
router.patch('/profile', UpdateCustomerProfile)

// carts
// cart - add
router.post('/cart', AddCart)
// cart - get
router.get('/cart', GetCart)
// cart - delete
router.delete('/cart', DeleteCart)

// orders
// order - create 
router.post('/order', CreateOrder)
// order - get
router.get('/orders', GetOrders)
// order - deatils
router.get('/order/:id', GetOrderById)

// offer
// offer - verify
router.get('/offer/verify/:id', VerifyOffer)

// payment
// payment - create
router.post('/payment', CreatePayment)
export { router as CustomerRoute };