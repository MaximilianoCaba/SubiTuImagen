var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var async = require('async');
var crypto = require('crypto');
var User = require('../../models/user')
var smtpTransport = require("nodemailer-smtp-transport")
var bcrypt = require('bcryptjs');
var usuario = require('../../middleware/security')


var smtpTransport = nodemailer.createTransport(smtpTransport({
    host: "smtp.live.com",
    secureConnection: false,
    port: 587,
    auth: {
        user: "maxi_utn@live.com.ar",
        pass: "mi contraseña"
    }
}))


router.route('/forgot')
    .get(usuario.userwithoutpw, function (req, res) {
        res.render('forgot');
    })

    .post(usuario.userwithoutpw, function (req, res, next) {
        async.waterfall([
            function (done) {
                crypto.randomBytes(20, function (err, buf) {
                    var token = buf.toString('hex');
                    done(err, token);
                });
            },
            function (token, done) {
                User.findOne({email: req.body.email}, function (err, user) {
                    if (!user) {
                        req.flash('error_msg', 'No existe esa cuenta en nuestra base de datos');
                        return res.redirect('/forgot');
                    }

                    user.resetPasswordToken = token;
                    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                    user.save(function (err) {
                        done(err, token, user);
                    });
                });
            },
            function (token, user, done) {

                var mailOptions = {
                    to: user.email,
                    from: 'reset@subituimagen.com',
                    subject: 'Reinicio de Contraseña',
                    text: 'Usted ah solicitado un reinicio de su contraseña\n\n' +
                    'presione en el siguiente link para poder ralizar el pedido:\n\n' +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    'si usted no requiere un cambio de contraseña en' + req.headers.host + 'por favor ignora este mensaje\n' +
                    'este mensaje es automatico, por favor no responda a el, no obtendra ninguna respuesta\n\n'

                };
                smtpTransport.sendMail(mailOptions, function (err) {
                    req.flash('success_msg', 'se ha enviado las instrucciones para resetear tu password a ' + user.email + ' recuerda, tienes una hora para cambiarla!');
                    done(err, 'done');
                });
            }
        ], function (err) {
            if (err) return err;
            res.redirect('/forgot');
        });
    });

router.route(usuario.userwithoutpw, '/reset/:token')
    .get((req, res) => {
        User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: {$gt: Date.now()}
        }, function (err, user) {
            if (!user) {
                req.flash('error_msg', 'EL token es invalido o expiro, por favor pide nuevamente resetear tu contraseña');
                return res.redirect('/forgot');
            }
            res.render('resetpw', {user: user});
        });
    })
    .post(usuario.userwithoutpw, function (req, res) {
        async.waterfall([
            function (done) {
                User.findOne({
                    resetPasswordToken: req.params.token,
                    resetPasswordExpires: {$gt: Date.now()}
                }, function (err, user) {
                    if (!user) {
                        req.flash('error_msg', 'EL token es invalido o expiro, por favor pide nuevamente resetear tu contraseña');
                        return res.redirect('/forgot');
                    }

                    var password = req.body.password;
                    var password2 = req.body.password2
                    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

                    var errors = req.validationErrors();

                    if (errors) {
                        req.flash('error_msg', "Las contraseñas deben ser iguales");
                        res.redirect('/reset/' + req.params.token)
                    } else {

                        if (req.body.password == "" || req.body.password2 == "") {
                            req.flash('error_msg', "La contraseña esta vacia");
                            res.redirect('/reset/' + req.params.token)
                        } else {

                            bcrypt.genSalt(10, function (err, salt) {
                                bcrypt.hash(password, salt, function (err, hash) {
                                    user.password = hash;
                                    user.resetPasswordToken = undefined;
                                    user.resetPasswordExpires = undefined;
                                    user.save(function (err) {
                                        req.logIn(user, function (err) {
                                            req.flash('success_msg', 'Su contraseña ah sido cambiada con exito!');
                                            done(err, user);
                                        });
                                    });
                                })
                            })
                        }
                    }
                });
            },
        ], function (err) {
            if (err) return err;
            res.redirect('/')
        });
    });

module.exports = router;