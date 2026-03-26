const express = require('express');
const { register, login, googleLogin, forgotPassword, resetPassword } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.post('/forgotpassword', forgotPassword); 
router.put('/resetpassword/:token', resetPassword); 


module.exports = router;