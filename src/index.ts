import express from 'express'
import App from './services/ExpressApp'
import DbConnection from './services/Database'
import { PORT } from './config';

const StartServer = async() =>{
    const app = express();
    // db connect
    await DbConnection();
    // app intialized
    await App(app)
    // port listen
    app.listen(PORT,()=>{
        console.log(`sever listen on port ${PORT}`)
    })
}
StartServer();