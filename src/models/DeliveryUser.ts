import mongoose, {Schema, Document, Model} from "mongoose";
 
interface DeliveryUserDoc extends Document {
    firstName:string;
    lastName:string;
    phone:string;
    email:string;
    password:string;
    salt:string;
    address:string;
    pincode:string;
    lat:number;
    lng:number;
    verified:boolean;
    isActive:boolean
}

const DeliveryUserSchema = new Schema({
    firstName:{ type:String},
    lastName:{ type:String},
    phone:{ type:String, require:true},
    email:{ type:String, require:true},
    salt:{ type:String, require:true},
    password:{ type:String, require:true},
    address:{ type:String},
    pincode:{ type:String},
    lat:{ type:Number},
    lng:{ type:Number},
    verified:{ type:Boolean, required:true},
    isActive:{ type:Boolean, default:false},
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

const DeliveryUser = mongoose.model<DeliveryUserDoc>('delivery_user',DeliveryUserSchema)
export {DeliveryUser}