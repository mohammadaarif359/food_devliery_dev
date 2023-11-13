import mongoose,{Schema, Document, Model} from "mongoose";

export interface TransactionDoc extends Document {
    customerId:string;
    vendorId:string;
    orderId:string;
    offerId:string|null;
    orderValue:number;
    status:string;
    paymentMode:string;
    paymentResponse:string|null;
}   

const TransactionSchema = new Schema({
    customerId:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'customer',
        require:true
    },
    vendorId:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'vendor',
        require:true
    },
    orderId:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'order',
        require:true
    },
    offerId:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'offer',
        default:null
    },
    orderValue:{ type:Number, require:true},
    status:{ type:String,require:true},
    paymentMode:{ type:String, require:true},
    paymentResponse:{ type:String, default:null},
},{
    toJSON:{ // for remove the give which not return in response
        transform(doc,ret) {
            delete ret._v;
        }
    },
    timestamps:true
});

const Transaction = mongoose.model<TransactionDoc>('transaction',TransactionSchema)
export {Transaction}   