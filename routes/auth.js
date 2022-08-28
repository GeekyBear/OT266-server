var express = require('express');
var router = express.Router();

//Import controllers
const {
    authRegisterGET,
    authRegisterPOST,
    authLoginGET,
    authLoginPOST,
    authMyInfoGET
} = require("../controllers/authController")
//Validators
const {registerFormValidate} = require('../utils/validators/registerForm/registerUser')
const {loginFormValidate} = require("../utils/validators/LoginForm/loginUser");
const { verifyUser } = require('../middleware/verifyUser');


/* GET home page. */
router.get('/register', authRegisterGET);
router.post('/register',registerFormValidate, authRegisterPOST)

//For login
router.get('/login', authLoginGET)
router.post('/login',loginFormValidate, authLoginPOST)

//For getting the user information
router.get('/me', verifyUser, authMyInfoGET);

module.exports = router;