const Sequelize = require('sequelize');

const sequelize = new Sequelize('pehal','root','Sharpenarian1998',{
    dialect:'mysql',
    host:'localhost'
})
 
module.exports = sequelize;