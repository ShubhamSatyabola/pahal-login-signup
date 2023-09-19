const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const ForgotPass = sequelize.define('forgotPass',{
    id:{type:Sequelize.STRING,
    allowNull: false,
    primaryKey: true
    },
    isactive: Sequelize.BOOLEAN
})  
module.exports = ForgotPass ;