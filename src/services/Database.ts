import mongoose from 'mongoose';
import { MONGO_URI } from '../config';

export default async() =>{
    try {
        await mongoose.connect(MONGO_URI)
        console.log('mongo connected')
    } catch(err) {
        console.log('mongo db error',err)
    } 
}
 
