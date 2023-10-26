import mongoose,{Schema, Document, Model} from "mongoose";

export interface FoodDoc extends Document {
    vendorId:string;
    name:string;
    description:string;
    category:string;
    foodType:string;
    readyTime:number;
    price:number;
    rating:number;
    images:[string];
}   

const FoodSchema = new Schema({
    vendorId:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'vendor'
    },
    name:{ type:String, require:true},
    description:{ type:String, require:true},
    category:{ type:String},
    foodType:{ type:String, require:true},
    readyTime:{ type:Number},
    price:{ type:Number, require:true},
    rating:{ type:Number, default:0},
    images:{ type:[String]}
},{
    toJSON:{ // for remove the give which not return in response
        transform(doc,ret) {
            delete ret._v;
        }
    },
    timestamps:true
});

const Food = mongoose.model<FoodDoc>('food',FoodSchema)
export {Food}   