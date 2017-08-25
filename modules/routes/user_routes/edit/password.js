var express = require('express');
var router = express.Router();
var User = require('../../../models/user');
var bcrypt = require('bcryptjs');
var security = require("../../../middleware/security");


router.route("/edit/password/:id")
    .get(security.invited, security.unauthorized, security.suspension, (req, res) => {

                User.findById(req.params.id, (err, user) => {
                    if (err) {
                        console.log(err)
                    }
                    res.render("user/edit/password", {user})
                })
    })
    .put(security.invited, security.unauthorized, security.suspension,(req, res) => {
                if (req.body.password != "") {
                    password = req.body.password
                    password2 = req.body.password2
                    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
                } else {
                    req.flash('error_msg', 'No ingreso una nueva contraseña por lo tanto no se ha cambiado');
                    password = res.locals.user.password
                }

                var errors = req.validationErrors();

                if (errors) {
                    req.flash('error_msg', "Las contraseñas deben ser iguales")
                    res.redirect('/user/edit/password/' + req.params.id)
                } else {
                    User.findById(req.params.id, (err, user) => {
                        if (errors) {
                            res.render('user/edit/password', {errors: `usuario no encontrada ${errors}`})
                        }
                        user.password = password;
                        if (user.password == res.locals.user.password) {
                            user.save((errors) => {
                                if (errors) {
                                    res.render('user/edit/password', {errors: `imposible de guardar la contraseña ${errors}`})
                                }
                                console.log(user)
                                res.redirect('/user/perfil');
                            })
                        } else {
                            bcrypt.genSalt(10, function (err, salt) {
                                bcrypt.hash(user.password, salt, function (err, hash) {
                                    user.password = hash;
                                    user.save((errors) => {
                                        if (errors) {
                                            res.render('user/edit/password', {errors: `imposible de guardar la contraseña ${errors}`})
                                        }
                                        console.log(user)
                                        req.flash('success_msg', 'Tu contraseña ha sido cambiada con exito, Por favor vuelva a iniciar session');
                                        req.logout();
                                        res.redirect('/users/login');
                                    })
                                })
                            })
                        }
                    })
                }
    })


module.exports = router;