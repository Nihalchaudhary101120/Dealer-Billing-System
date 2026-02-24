import express from 'express';
import {register} from '../controller/authControllers/register.js';
import {verify_otp} from '../controller/authControllers/verifyOtp.js';
import {login} from '../controller/authControllers/login.js';
import {resend_otp} from '../controller/authControllers/resendOtp.js';
import {logout} from '../controller/authControllers/logout.js';
import {forgotPassword} from '../controller/authControllers/forgotPassword.js';
import {verify_reset_pass_otp} from '../controller/authControllers/verifyresetPassOtp.js'
import {resetPassword} from '../controller/authControllers/resetPassword.js';

const router = express.Router();

router.post('/register',register);
router.post('/verify_otp', verify_otp);
router.post('/resend_otp', resend_otp);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot_password', forgotPassword);
router.post('/verify_reset_otp', verify_reset_pass_otp);
router.post('/reset_password', resetPassword);


router.get('/me',(req,res)=>{
    if(req.session && req.session.user){
        return res.json({user:req.session.user});
    }
    return res.status(200).json({user:null});
});

export default router;