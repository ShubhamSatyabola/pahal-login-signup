const {Op} = require('sequelize')
const bcrypt = require('bcrypt')
const otpGenerator = require('otp-generator')
const fast2sms = require('fast2sms')
const sendinblue = require('sib-api-v3-sdk')
const jwt = require('jsonwebtoken')

const User = require('../models/user');

function generateAcessToken(email){
    return jwt.sign({useremail:email},process.env.Token)
}
function generateOTP(){
    // return otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
        const digits = '0123456789';
        let OTP = '';
        for (let i = 0; i < 6; i++) {
          OTP += digits[Math.floor(Math.random() * 10)];
        }
        return OTP;
}
exports.postSignup = async (req,res)=>{
    try{
        const {name,email,password} = req.body;
        // console.log(name);
        if(name.length==0||email.length==0||password.length==0){
            return res.status(500).json({sucess:false, message:'all fields required'})
        }
        const user = await User.findOne({where:{email:email}})
        if(!user){
        const otp = generateOTP()
        // console.log(otp)
        bcrypt.hash(password, 10, async (err,hash)=>{
            if(err){
                return res.status(500).json({error:err})
            }
            else{
                const data = await User.create({
                    name:name,
                    email:email,
                    password:hash,
                    otp:otp,
                    status:false
                })
                const client =sendinblue.ApiClient.instance

        const apiKey = client.authentications['api-key']
        apiKey.apiKey = process.env.SibKey;
        const tranEmailApi = new sendinblue.TransactionalEmailsApi()

        const sender = {
            email: 'satyabolashubham@gmail.com'
        }
        const receivers = [
            {
                email: email
            }
        ]
        //console.log(sender,receivers)
           
        const reset = await tranEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: 'One Time Password',
            textContent: `OTP for your Pehal registration is ${otp}`,
            // htmlContent:`<a href="http://localhost:3000/password/reset-password/${id}">Reset Password</a>`
        })
                res.status(200).json({success:true,message:'Please Enter OTP',token:generateAcessToken(email)})
                }
            })
        }
        else{
            
            return res.status(500).json({success:false,message:'User already exist'})
        }
        }
    catch(err){
        console.log(err)
        res.status(500).json({err})
    }
}
exports.verifyOtp= async(req,res,next)=>{
    try{
        const {otp,token} = req.body
        const email = jwt.verify(token,process.env.Token)
        // console.log(email)
        const user = await User.findOne({where:{email:email.useremail}})
        if(user.otp === otp){
            user.update({status:true})
            res.status(200).json({success:true,message:'Registration Successfull'})
        }
        else{
            res.status(500).json({success:false,message:'Incorrect OTP'})
        }


    }
    catch(err){
        console.log(err)
        res.status(500).json({success:false})

    }
}

exports.postLogin = async (req,res,next)=>{
    try{
        const {email,password} = req.body;
        if(email.length===0||password.length===0){
            return res.status(500).json({success:false,message:'all fields required'})
        }
        const user = await User.findOne({where:{email:email}});
        if(user){
            if(user.status == false){
                return res.status(404).json({success:false,message:'User not registered'})
            }
            bcrypt.compare(password,user.password,(err,result)=>{
                if(err){
                    return res.status(500).json({success:false,message:'something went wrong'})
                }
                if(result==true){
                    return res.status(200).json({success:true,message:'login successfully'
                })
                }
                else{
                    res.status(500).json({success:false,message:"incorrect password"})
                }
                
            })
        }
        else{
            return res.status(404).json({success:false,message:'user not exist please signup'})
        }
    }
    catch(err){
        console.log(err)
    }
}
