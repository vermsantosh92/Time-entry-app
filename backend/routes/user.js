const express = require("express");
const userController = require('../controllers/user')

const sendWelcomeEmail = require('../emails/account');


const router = express.Router();


router.post("/signup", userController.createUser );

router.post("/login", userController.loginUser);

module.exports = router;
