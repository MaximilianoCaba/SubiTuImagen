var express = require('express');
var router = express.Router();
var User = require('../../../models/user');
var security = require("../../../middleware/security");


router.route("/edit/email/:id")
    .get(security.invited, security.unauthorized, security.suspension, (req, res) => {

        User.findById(req.params.id, (err, user) => {
            if (err) {
                console.log(err)
            }
            res.render("user/edit/email", {user})
        })
    })
    .put(security.invited, security.unauthorized, security.suspension, (req, res) => {
        if (req.body.email == "") {
            req.flash('error_msg', 'Debes ingresar un Email')
            res.redirect('/user/edit/email/' + req.params.id)
        } else {
            email = req.body.email;
            req.checkBody('email', 'Email is not valid').isEmail();

            var err = req.validationErrors();

            if (err) {
                req.flash('error_msg', 'Debes ingresar un Email Valido')
                res.redirect('/user/edit/email/' + req.params.id)

            } else {

                User.getUserByEmail(req.body.email, (err, user) => {
                    if (err) {
                        err
                    }
                    else {

                        if (user == null) {

                            req.flash('error_msg', 'Ese email ya esta registrado')
                            res.redirect('/user/edit/email/' + req.params.id)

                        } else {

                            User.findById(req.params.id, (err, user) => {
                                if (err) {
                                    err
                                }

                                user.email = req.body.email

                                user.save((err) => {
                                    if (err) {
                                        err
                                    }

                                    req.flash('success_msg', 'Email modificado con exito')
                                    res.redirect('/user/perfil');

                                })
                            })
                        }
                    }
                })
            }
        }
    })
module.exports = router