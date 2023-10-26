import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NO } from "../config";

export const GenerateOtp = () =>{
    const otp = Math.floor(100000 + Math.random() * 900000)
    let expiry = new Date();
    expiry.setTime(new Date().getTime() + (30*60*1000))
    return {otp,expiry}
}

export const onRequestOtp = async(otp:number,phone:string) => {
    const accountSid = TWILIO_ACCOUNT_SID;
    const authToken = TWILIO_AUTH_TOKEN;
    const fromNo = TWILIO_FROM_NO

    const client = require('twilio')(accountSid,authToken);
    const response = await client.messages.create({
        body: `Your otp is ${otp}`,
        from: fromNo,
        to: phone
    })
    return response
} 