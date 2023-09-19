const express = require('express');
const bodyparser= require('body-parser')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()
// const http = require('http')

const path = require('path');

const sequelize = require('./util/database')
const User = require('./models/user')
const ForgotPass = require('./models/forgotpass')
const userRoutes = require('./routes/user')
const forgotpassRoute = require('./routes/forgotpass')

const app = express();


app.use(cors({
    origin:'*' //accept request from every origin if we specify address than sorce will get limited
}));
app.use(bodyparser.json({extended:false}))
//app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/user', userRoutes)

app.use('/password',forgotpassRoute)


app.use((req,res,next)=>{
    res.sendFile(path.join(__dirname, `../frontend/${req.url}`))

})

User.hasMany(ForgotPass);
ForgotPass.belongsTo(User)




sequelize.sync({force:false})
.then(app.listen(3000))
.catch(err=>console.log(err))

