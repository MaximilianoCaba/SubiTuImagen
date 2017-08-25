var express = require('express');
var router = express.Router();
var email = require("./edit/email");
var password = require("./edit/password");
var avatar = require("./edit/avatar");
var perfil =require("./perfil");


router.use(email);
router.use(password);
router.use(avatar);
router.use(perfil);


module.exports = router;