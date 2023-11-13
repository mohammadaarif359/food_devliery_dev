import express,{ Application } from 'express'
import path from 'path'
import responseTime from "response-time"
import { AdminRoute,CustomerRoute,ShoppingRoute,VendorRoute,DeliveryRoute } from '../routes'
import * as redis from 'redis';
import { promisify } from 'util';
import axios from 'axios';

export default async (app:Application) =>{

    app.use(express.json())
    app.use(express.urlencoded({extended:true}))
    app.use(responseTime())

    // Assuming you have Redis server running on the default localhost and port
    /* const client = redis.createClient({
        host:'127.0.0.1',
        port:6379
    } as redis.RedisClientOptions);


    const GET_AYSNC = promisify(client.get).bind(client)
    const SET_AYSNC = promisify(client.set).bind(client)

    // for rocket api get
    app.get('/rockets',async(req,res,next)=>{
        const responseCache = await GET_AYSNC('hello')
        console.log('already cached',responseCache)
        if(responseCache) {
            res.send(JSON.parse(responseCache))
        } else {
            // const response = await axios.get('https://api.spacexdata.com/v3/rockets')
            // console.log('response',response.data);
            const responseCahce = await SET_AYSNC('hello',JSON.stringify({"hello":"by cache"}),'EX',300)
            console.log('new responseCahce',responseCahce)
            res.send({"hello":"without cache"})
        }
    }) */
    //for images path set
    app.use('/images',express.static(path.join(__dirname, '../images')))

    // admin route
    app.use('/admin',AdminRoute)
    // vendor route
    app.use('/vendor',VendorRoute)
    // shopping route
    app.use('/shopping',ShoppingRoute)
    // customer route
    app.use('/customer',CustomerRoute)
    // delivery route
    app.use('/delivery', DeliveryRoute)
    // check service
    app.use('/',(req,res)=>{
        return res.json({"msg":'hello backend service is running'})
    })
    return app;
}
