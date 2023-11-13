import { Request,Response,NextFunction } from "express";
import { plainToClass } from 'class-transformer'
import { validate } from "class-validator";
import { CreateCustomerInput,CreateOrderInput,CustomerLoginInput, UpdateCustomerInput } from "../dto/Customer.dto";
import { GenerateOtp, GeneratePassword, GenerateSalt, GenerateToken, ValidatePassword, onRequestOtp } from "../utility";
import { Customer, DeliveryUser, Food, Offer, Transaction, Vendor } from "../models";
import { Order } from "../models/Order";
import { CompositionListInstance } from "twilio/lib/rest/video/v1/composition";

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

// cart
export const AddCart = async(req:Request,res:Response,next:NextFunction) => {
    const customer = req.user
    const profile = await Customer.findById(customer._id).populate('cart.food')
    if(customer && profile) {
        let cartItems = []
        const {_id,unit} = <CreateOrderInput>req.body
        // check cart food exits
        const food = await Food.findById(_id)
        if(food) {
            cartItems = profile.cart;
            if(cartItems.length > 0) {
                // check item extis and update
                let exitsFoodCart = cartItems.filter((item)=> item.food._id.toString() === _id)
                if(exitsFoodCart.length > 0) {
                    const index = cartItems.indexOf(exitsFoodCart[0])
                    if(unit > 0) {
                        cartItems[index] = {food,unit}
                    } else {
                        cartItems.splice(index,1)
                    }
                    
                } else {
                    cartItems.push({food,unit})
                }
            } else {
                // add new
                cartItems.push({food,unit})
            }
            if(cartItems) {
                profile.cart = cartItems as any
                const result = await profile.save()
                return res.status(200).json(result.cart)
            } 
        }
    }
    return res.status(400).json({'message':'customer not found'})

}    
export const GetCart = async(req:Request,res:Response,next:NextFunction) => {
    const customer = req.user
    if(customer) {
        const profile = await Customer.findById(customer._id).populate('cart.food')
        return res.status(200).json(profile.cart)
    }
    return res.status(400).json({'message':'customer not found'})
}
export const DeleteCart = async(req:Request,res:Response,next:NextFunction) => {
    const customer = req.user
    if(customer) {
        const profile = await Customer.findById(customer._id).populate('cart.food')
        profile.cart = [] as any;
        const result = await profile.save();
        return res.status(200).json(result.cart)
    }
    return res.status(400).json({'message':'cart alreay empty'})
}

const assignOrderForDelivery = async(orderId: string, vendorId: string) => {
    // find the vendor
    const vendor = await Vendor.findById(vendorId);
    if(vendor){
        const areaCode = vendor.pincode;
        const vendorLat = vendor.lat;
        const vendorLng = vendor.lng;
        //find the available Delivery person
        const deliveryPerson = await DeliveryUser.find({ pincode: areaCode, verified: true, isAvailable: true});
        if(deliveryPerson){
            // Check the nearest delivery person and assign the order
            const currentOrder = await Order.findById(orderId);
            if(currentOrder){
                //update Delivery ID
                currentOrder.deliveryId = deliveryPerson[0]._id; 
                await currentOrder.save();

                // notify delivery and vendor person for order
            }
        }
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
        let vendorId;

        // calculate order amount
        const foods = await Food.find().where('_id').in(cart.map(item=> item._id)).exec();
        console.log('foods',foods)
        foods.map(food=>{
            cart.map(({_id,unit})=>{
                if(food._id == _id) {
                    vendorId = food.vendorId
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
                vendorId,
                items:cartItems,
                totalAmount:netAmount,
                orderDate:new Date(),
                paidThrough:'COD',
                paymentResponse:'',
                orderStatus:'Waiting',
                readyTime:45

            })
            // update order to user account
            if(order) {
                // make cart clean
                profile.cart = [] as any;
                
                // add order to customer account
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

export const VerifyOffer = async(req:Request,res:Response,next:NextFunction) => {
    const user = req.user
    const id = req.params.id
    const offer = await Offer.findOne({_id:id,isActive:true})
    if(offer) {
        return res.status(200).json({"message":"This offer is valid",offer})
    }
    return res.status(400).json({"message":"offer not found"}) 
}

export const CreatePayment = async(req:Request,res:Response,next:NextFunction) => {
    const user = req.user
    const {amount,paymentMode,offerId} = req.body
    let payAmount = Number(amount)

    if(offerId) {
        const appliedOffer = await Offer.findOne({_id:offerId,isActive:true})
        if(appliedOffer) {
            payAmount = amount - appliedOffer.offerAmount
        }
    }
    // payment gateway api call

    // add payment transction
    const transction = await Transaction.create({
        cusotmerId:user._id,
        vendorId:user._id,
        orderId:user._id,
        offerId: offerId || null,
        orderValue:payAmount,
        status:'Peding',
        paymentMode:paymentMode,
        paymentResponse:null
    })

    return res.status(200).json(transction)
}    