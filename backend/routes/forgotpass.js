const express = require('express');

const forgotpassController = require('../controllers/forgotpass');

const router = express.Router();

router.use('/forgot-password', forgotpassController.forgotPassword);

router.get('/reset-password/:uuid', forgotpassController.resetPassword);

router.get('/update-password/:uuid', forgotpassController.updatePassword);

module.exports = router;