import mongoose,{Schema, Document, Model} from "mongoose";

export interface OrderDoc extends Document {
    orderId:string;
    items:[any] // [{food,unit}]
    totalAmount:number;
    orderDate:Date;
    paidThrough:string // [COD,Credit Card,Wallet]
    paymentResponse:string // {status:ture,response:payment response}
    orderStatus:string
}   

const OrderSchema = new Schema({
    orderId:{ 
        type:String,
        require:true
    },
    items: [
        {
            food:{type:Schema.Types.ObjectId,ref:"food",require:true},
            unit:{type:Number,require:true}
        }
    ],
    totalAmount:{ 
        type:Number,
        require:true
    },
    orderDate:{ 
        type:Date,
        require:true
    },
    paidThrough:{ 
        type:String,
        require:true
    },
    paymentResponse:{
        type:String
    },
    orderStatus:{
        type:String
    }
},{
    toJSON:{ // for remove the give which not return in response
        transform(doc,ret) {
            delete ret._v;
        }
    },
    timestamps:true
});

const Order = mongoose.model<OrderDoc>('order',OrderSchema)
export {Order}   