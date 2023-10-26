import { Request,Response,NextFunction } from "express";
import { plainToClass } from 'class-transformer'
import { validate } from "class-validator";
import { CreateCustomerInput,CreateOrderInput,CustomerLoginInput, UpdateCustomerInput } from "../dto/Customer.dto";
import { GenerateOtp, GeneratePassword, GenerateSalt, GenerateToken, ValidatePassword, onRequestOtp } from "../utility";
import { Customer, Food } from "../models";
import { Order } from "../models/Order";

export const CustomerSingUp = async(req:Request,res:Response,next:NextFunction) => {
    const customerInputs = plainToClass(CreateCustomerInput,req.body)
    const inputErrors = await validate(customerInputs, {validationError:{target:true}})
    if(inputErrors.length > 0) {
        return res.status(400).json(inputErrors)
    }

    const { email,phone,password } = customerInputs

    const exitsingCustomer = await Customer.findOne({email:email})
    if(exitsingCustomer) {
        return res.status(400).json({"message":"An user already exits with this email"})
    }

    const salt = await GenerateSalt();
    const userPassowrd = await GeneratePassword(password,salt)

    const {otp,expiry} = await GenerateOtp();
    const result = await Customer.create({
        firstName:'',
        lastName:'',
        email,
        phone,
        password:userPassowrd,
        salt,
        address:'',
        lat:0,
        lng:0,
        verified:false,
        otp,
        otp_expiry:expiry,
        orders:[]
    })
    if(result) {
        // send otp
        // await onRequestOtp(otp,phone)
        // generate token
        const token = await GenerateToken({
            _id:result.id,
            email:result.email,
            verified:result.verified
        })

        // return result
        return res.status(200).json({email:result.email,verified:result.verified,token})
    }
    return res.status(500).json({"message":"something went wrong"})
}

export const CustomerLogin = async(req:Request,res:Response,next:NextFunction) => {
    const loginInputs = plainToClass(CustomerLoginInput,req.body)
    const inputErrors = await validate(loginInputs, {validationError:{target:true}})
    if(inputErrors.length > 0) {
        return res.status(400).json(inputErrors)
    }

    const {email,password} = loginInputs
    const result = await Customer.findOne({email:email}) 
    if(result) {
        const verifyPassword = await ValidatePassword(password,result.password,result.salt)
        if(verifyPassword) {
            const token = await GenerateToken({
                _id:result.id,
                email:result.email,
                verified:result.verified
            }) 

            return res.status(200).json({email:result.email,verified:result.verified,token})
        } else {
            return res.status(400).json({"message":"invalid email"})
        }
    } else {
        return res.status(400).json({"message":"invalid password"})
    }
}

export const CustomerVerify = async(req:Request,res:Response,next:NextFunction) => {
    const {otp} = req.body
    const user = req.user
    const customer = await Customer.findById(user._id)
    if(customer) {
        console.log('new Date()',new Date())
        if(customer.otp === parseInt(otp) && customer.otp_expiry >= new Date()) {
            customer.verified = true;
            const updatedCustomer = await customer.save();

            // generate token
            const token = await GenerateToken({
                _id:updatedCustomer.id,
                email:updatedCustomer.email,
                verified:updatedCustomer.verified
            }) 
            return res.status(200).json({email:updatedCustomer.email,verified:updatedCustomer.verified,token})
        } else {
            return res.status(400).json({'message':"invalid otp"})
        }
    } else {
        return res.status(400).json({'message':"customer not found"})
    }
}

export const RequestOtp = async(req:Request,res:Response,next:NextFunction) => {
    const user = req.user;
    const customer = await Customer.findById(user._id)
    if(customer) {
        // generate otp
        const {otp,expiry} = await GenerateOtp();
        customer.otp = otp
        customer.otp_expiry = expiry
        await customer.save();
        // send otp
        // await onRequestOtp(otp,customer.phone)
        return res.status(200).json({"message":"otp has send to registed number"})
    }
    
}

export const GetCustomerProfile = async(req:Request,res:Response,next:NextFunction) => {
    const user = req.user
    const customer = await Customer.findById(user._id)
    return res.status(200).json(customer) 

}

export const UpdateCustomerProfile = async(req:Request,res:Response,next:NextFunction) => {
    const user = req.user
    const customerInputs = plainToClass(UpdateCustomerInput,req.body)
    const inputErrors = await validate(customerInputs, {validationError:{target:true}})
    if(inputErrors.length > 0) {
        return res.status(400).json(inputErrors)
    }
    
    const customer = await Customer.findById(user._id)
    if(customer) {
        const {firstName,lastName,address} = req.body
        customer.firstName = firstName
        customer.lastName = lastName
        customer.address = address
        const result = await customer.save();
        return res.status(200).json(result)
    } else {
        return res.status(400).json({'message':"customer not found"})
    }
     
}

export const CreateOrder = async(req:Request,res:Response,next:NextFunction) => {
    // logged in user
    const customer = req.user
    if(customer) {
        // create order id
        const orderId = `${Math.floor(Math.random() * 89999) + 1000}`;
        const profile = await Customer.findById(customer._id);

        // get order item from req [ {'id':1,unit:1},{'id':2,'unit':2}  ]
        const cart = <[CreateOrderInput]>req.body;
        console.log('cart',cart)
        let cartItems = [];
        let netAmount = 0.0

        // calculate order amount
        const foods = await Food.find().where('_id').in(cart.map(item=> item._id)).exec();
        console.log('foods',foods)
        foods.map(food=>{
            cart.map(({_id,unit})=>{
                if(food._id == _id) {
                    netAmount += food.price * unit
                    cartItems.push({food,unit})
                }
            })
        })
        console.log('cartItems',cartItems)

        // create order with item
        if(cartItems) {
            const order = await Order.create({
                orderId,
                items:cartItems,
                totalAmount:netAmount,
                orderDate:new Date(),
                paidThrough:'COD',
                paymentResponse:'',
                orderStatus:'Waiting'
            })
            // update order to user account
            if(order) {
                profile.orders.push(order);
                await profile.save();
                return res.status(200).json(order)
            }
        }
        return res.status(400).json({"message":"empty cart or cart item not match to our menu"})
    } else {
        return res.status(400).json({"message":"customer not found"})
    }
}

export const GetOrders = async(req:Request,res:Response,next:NextFunction) => {
     // logged in user
    const customer = req.user
    if(customer) {
        const profile = await Customer.findById(customer._id).populate(['orders','orders.items.food'])
        return res.json(profile.orders)
    } else {
        return res.status(400).json({"message":"customer not found"})
    }
        
}

export const GetOrderById = async(req:Request,res:Response,next:NextFunction) => {
    const id = req.params.id
    const order = await Order.findById(id).populate('items.food')
    if(order) {
        return res.status(200).json(order)
    } else {
        return res.status(400).json({"message":"ordet not found"})
    }
}