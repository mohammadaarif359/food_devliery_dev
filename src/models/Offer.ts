import mongoose,{Schema, Document, Model} from "mongoose";

export interface OfferDoc extends Document {
    offerType:string; // VENDOR.GENERIC
    vendors:[any];
    title:string;
    description:string|null;
    minValue:number;
    offerAmount:number;
    startValidity:Date;
    endValidity:Date;
    promocode:string;
    promoType:string;
    bank:[any];
    bins:[any];
    pincode:string|null;
    isActive:boolean
}   

const OfferSchema = new Schema({
    offerType:{ type:String, require:true},
    vendors:[{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'vendor'
    }],
    title:{ type:String,require:true},
    description:{ type:String,deafult:null},
    minValue:{ type:Number,require:true},
    offerAmount:{ type:Number,require:true},
    startValidity:{ type:Date,require:true},
    endValidity:{ type:Date,require:true},
    promocode:{ type:String,require:true},
    promoType:{ type:String,require:true},
    bank:[{ type:String}],
    bins:[{ type:Number}],
    pincode:{ type:String,require:true},
    isActive:{ type:Boolean,deafult:false},
},{
    toJSON:{ // for remove the give which not return in response
        transform(doc,ret) {
            delete ret._v;
        }
    },
    timestamps:true
});

const Offer = mongoose.model<OfferDoc>('offer',OfferSchema)
export {Offer}   