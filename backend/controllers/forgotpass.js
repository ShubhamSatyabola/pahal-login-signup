const uuid = require('uuid')
const sendinblue = require('sib-api-v3-sdk');
const bcrypt = require('bcrypt')

const User =  require('../models/user');
const ForgotPass = require('../models/forgotpass');


exports.forgotPassword = async(req,res,next)=>{
    try{
        const email = req.body.email;
        //console.log(email)
        const user = await User.findOne({where:{email}});
        if(!user){
            throw new Error('User Not Exist')
        }
        else{
        const id = uuid.v4()
        const resetpassword = await user.createForgotPass({id:id,isactive:true})
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
            subject: 'reset password',
            textContent: 'reset your password here',
            htmlContent:`<a href="http://localhost:3000/password/reset-password/${id}">Reset Password</a>`
        })
        //console.log(reset)
        //console.log(response)
        res.status(200).json({message:"email sent successfully"})

        }
        
    }
    catch(err){
        console.log(err)
        res.status(200).json({error:err})
    }

}
exports.resetPassword = async (req,res,next)=>{
    try{const id = req.params.uuid;
    const resetpassword = await ForgotPass.findOne({ where : { id }})
        if(resetpassword){
            await resetpassword.update({isactive: false});
            res.status(200).send(`<html>  
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>
                                    <form action="/password/update-password/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
                                )
            res.end()

        }
    }
    catch(err){
        console.log(err)
        res.status(400).json({error:err})
    }
}

exports.updatePassword = async(req,res,next)=>{
    try{
        const newpassword = req.query.newpassword;
        const id = req.params.uuid;
        const updatepassword = await ForgotPass.findOne({ where : { id: id }})
        const user = await User.findOne({where: { id : updatepassword.userId}})
                // console.log('userDetails', user)
            if(user) {
                    //encrypt the password
                    const saltRounds = 10;
                    bcrypt.hash(newpassword, saltRounds, async function(err, hash) {
                            if(err){
                                console.log(err);
                                throw new Error(err);
                            }
                            await user.update({ password: hash })
                            res.status(201).json({message: 'Successfuly update the new password'})
                            })
                        }
            else{
                throw new Error('User not found')
            }
    }    
    catch(err){
        console.log(err)
        res.status(404).json({error:err})
    }
}