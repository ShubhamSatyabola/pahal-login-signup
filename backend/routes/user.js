const express = require('express');

const userController = require('../controllers/user');

const router = express.Router();

router.post('/signup',userController.postSignup);

router.post('/verify',userController.verifyOtp);

router.post('/login',userController.postLogin);


module.exports = router;