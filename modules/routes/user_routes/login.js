var express = require('express');
var router = express.Router();
var passport = require('passport');
var multer = require('multer')
var User = require('../../models/user');
var Alert =require('../../models/alert');
var date = require('../../middleware/date');


// Register
router.get('/register', function(req, res){
	res.render('register');
});

// Login
router.get('/login', function(req, res){
	res.render('login');
});

// Register User
router.post('/register', date.dateNow, function(req, res){



	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;
    var avatar = "avatar.jpg";

    // Validation
	req.checkBody('email', 'Debe ingresar un Email').notEmpty();
	req.checkBody('email', 'Debe ingresar un Email valido').isEmail();
	req.checkBody('username', 'Debe ingresar un nombre de security').notEmpty();
	req.checkBody('password', 'La contraseña es obligatoria').notEmpty();
	req.checkBody('password2', 'Las contraseñas deben coincidir').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors
		});



	} else {
		var newUser = new User({
            username: username,
            password: password,
            email: email,
			avatar: avatar,
			role: "user_role",
			alerts: 1,
            facebook: {
                id: "null"
            },
            google: {
                id: "null"
            },
		});

		User.createUser(newUser, function(err, user){
			if(err) throw err;

            var newAlert= new Alert({
                message: "Bienvenido a SubiTuImagen.com, recuerda que puedes cambiar tu avatar seleccionando el boton [editar avatar]",
                user: user.id,
                date: req.date,
                hour: req.hour,
            })

			var alert = new Alert(newAlert);
			alert.save((err) =>{
				if(err){err}

                req.flash('success_msg', 'Gracias por registrarse, ahora puede acceder a su cuenta');
                res.redirect('/users/login');

            })

		});

	}
});

router.post('/login',
    passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),
    function(req, res) {
        res.redirect('/');
    });

router.get('/logout', function(req, res){
    req.logout();

    req.flash('success_msg', 'Usted ha cerrado session satisfactoriamente');

    res.redirect('/users/login');
});


module.exports = router;