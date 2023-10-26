import express,{ Application } from 'express'
import path from 'path'
import { AdminRoute,CustomerRoute,ShoppingRoute,VendorRoute } from '../routes'

export default async (app:Application) =>{

    app.use(express.json())
    app.use(express.urlencoded({extended:true}))
    //for images path set
    app.use('/images',express.static(path.join(__dirname,'images')))

    // admin route
    app.use('/admin',AdminRoute)
    // vendor route
    app.use('/vendor',VendorRoute)
    // shopping route
    app.use('/shopping',ShoppingRoute)
    // customer route
    app.use('/customer',CustomerRoute)
    // check service
    app.use('/',(req,res)=>{
        return res.json({"msg":'hello backend service is running'})
    })
    return app;
}
