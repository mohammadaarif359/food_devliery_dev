"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ExpressApp_1 = __importDefault(require("./services/ExpressApp"));
const Database_1 = __importDefault(require("./services/Database"));
const StartServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    // db connect
    yield (0, Database_1.default)();
    // app intialized
    yield (0, ExpressApp_1.default)(app);
    // port listen
    app.listen(8000, () => {
        console.log(`sever listen on port 8000`);
    });
});
StartServer();
/* import express from 'express'
import bodyParser from 'body-parser';
import path from 'path'
import mongoose from 'mongoose';
import { AdminRoute,VendorRoute } from './routes'
import { MONGO_URI } from './config';

const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
//for images path set
app.use('/images',express.static(path.join(__dirname,'images')))

mongoose.connect(MONGO_URI).then(resut=>{
    console.log('mongodb connected')
}).catch(err=>{
    console.log(err)
})

// admin route
app.use('/admin',AdminRoute)
// vendor route
app.use('/vendor',VendorRoute)
// check service
app.use('/',(req,res)=>{
    return res.json({"msg":'hello backend service is running'})
})

app.listen(8000,()=>{
    console.log('server listen on port 8000')
}) */ 
//# sourceMappingURL=index.js.map