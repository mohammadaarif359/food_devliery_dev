import mongoose, {Schema, Document, Model} from "mongoose";
import { OrderDoc } from "./Order";
 
interface CustomerDoc extends Document {
    firstName:string;
    lastName:string;
    phone:string;
    email:string;
    password:string;
    salt:string;
    address:string;
    lat:number;
    lng:number;
    verified:boolean;
    otp:number;
    otp_expiry:Date;
    cart:[any]
    orders:[OrderDoc]
}

const CustomerSchema = new Schema({
    firstName:{ type:String},
    lastName:{ type:String},
    phone:{ type:String, require:true},
    email:{ type:String, require:true},
    salt:{ type:String, require:true},
    password:{ type:String, require:true},
    address:{ type:String},
    lat:{ type:Number},
    lng:{ type:Number},
    verified:{ type:Boolean, required:true},
    otp: { type:Number, require:true},
    otp_expiry: { type:Date,require:true },
    cart:[
        {
            food: { type: Schema.Types.ObjectId, ref: 'food', require: true},
            unit: { type: Number, require: true}
        }
    ],
    orders:[
        {  type:Schema.Types.ObjectId,ref:'order'}
    ]
},{
    toJSON:{ // for remove the give which not return in response
        transform(doc,ret) {
            delete ret.password;
            delete ret.salt;
            delete ret._v;
        }
    },
    timestamps:true
});

const Customer = mongoose.model<CustomerDoc>('customer',CustomerSchema)
export {Customer}