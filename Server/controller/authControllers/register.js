import nodemailer from 'nodemailer';
import crypto from 'crypto';
import User from '../../models/user.js';
import bcrypt from 'bcrypt';

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user:'ajaymotors101120@gmail.com',
        pass:'mccrhayibkwnsbap'
    }
});

const generateOtp = ()=> crypto.randomInt(100000,999999).toString();

export const register = async(req, res)=>{
    try{
        const {name , email , password } = req.body;
        if(!name || !email || !password)
            return res.status(400).json({message:"All fields are required!"});

        let user = await User.findOne({email});
        if(user) return res.status(400).json({
            message:"user already exists"
        });

        const otp = generateOtp();
        const otpExpire = new Date(Date.now()+5*60*1000);

        const hashedPass = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password:hashedPass,
            otp,
            otpExpire
        })

        await transporter.sendMail({
            from : 'ajaymotors101120@gmail.com',
            to: email ,
            subject : 'otp verification',
            text :`Your otp is : ${otp} to Register on Dealer-Billing System `
        })

        res.status(201).json({message: "User registered. otp sent to email Please verify!"})
    }
    catch(err){
        res.status(500).json({
            message:"Error registering user",error: err.message
        });
    }
}