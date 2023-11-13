import mongoose, {Schema, Document, Model} from "mongoose";

interface VendorDoc extends Document {
    name:string;
    ownerName:string;
    foodType:[string];
    pincode:string;
    address:string;
    phone:string;
    email:string;
    password:string;
    salt:string;
    serviceAvialable:boolean;
    converImages:[string];
    rating:number;
    foods:any;
    lat:number;
    lng:number;
}

const VendorSchema = new Schema({
    name:{ type:String, require:true},
    ownerName:{ type:String, require:true},
    foodType:{ type:[String]},
    pincode:{ type:String, require:true},
    address:{ type:String},
    lat:{ type:Number,deafult:0},
    lng:{ type:Number,deafult:0},
    phone:{ type:String, require:true},
    email:{ type:String, require:true},
    password:{ type:String, require:true},
    salt:{ type:String, require:true},
    serviceAvialable:{ type:Boolean},
    converImages:{ type:[String]},
    rating:{ type:Number},
    foods:[{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'food'
    }]
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

const Vendor = mongoose.model<VendorDoc>('vendor',VendorSchema)
export {Vendor}