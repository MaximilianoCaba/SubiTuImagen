const express = require('express');
const router = express.Router();
const security = require('../../middleware/security');
const date = require('../../middleware/date');
const User = require('../../models/user');
const Alerts =require('../../models/alert');
const Imagen =require('../../models/imagen');
const Coment =require('../../models/coment');
const Like =require('../../models/like');
const Suspension =require('../../models/suspension');
const Report =require('../../models/report');
const fs =require('fs');




const async = require('async');


router.route('/users')
    .get(security.invited, security.administrator, (req, res) => {

        User.find({}, (err, users) => {
            if (err) {err}

            res.render('admin/user', {users})
        })

    });

router.route('/users/super')
    .get(security.invited, security.administrator, (req, res) => {
        User.find({role: {$in: ['admin_role', 'moderator_role']}}, (err, users) => {
            res.render('admin/user/superUser', {users})
        })
    })

    .put(security.invited, security.administrator, (req, res) => {
        User.find({email: req.body.email}, (err, users) => {
            if (users[0] != undefined) {
                const user = users[0];
                user.role = req.body.role;
                const u = new User(user);

                u.save((err) => {
                    if (err) {
                        console.log(err)
                    }
                    req.flash('success_msg', 'Se ha cambiado el rol de ' + user.username + " a " + user.role);
                    res.redirect('/admin/module/users/super')
                })
            } else {
                req.flash('error_msg', 'no se a encontrado al usuario con email ' + req.body.email);
                res.redirect('/admin/module/users/super')
            }
        })
    });

router.route('/user/:id')
    .get(security.invited, security.administrator, (req, res) => {
        User.findById(req.params.id, (err, useer) => {
            res.render('admin/user/user', {useer})
        })
    })

    .put(security.invited, security.administrator, (req, res) => {
        User.findById(req.params.id, (err, useer) => {


            if (useer.username == req.body.username && useer.email == req.body.email) {

                useer.role = req.body.role;
                useer.save((err) => {
                    if (err) {
                        console.log(err)
                    }
                    req.flash('success_msg', 'Se ha cambiado el rol de ' + useer.username + " a " + useer.role);
                    res.redirect('/admin/module/users/super')
                })

            } else {


                User.find({username: req.body.username}, (err, user) => {

                    if (user[0] == undefined || user[0].id == req.params.id) {

                        User.find({email: req.body.email}, (err, user2) => {

                            if (user2[0] == undefined || user2[0].id == req.params.id) {

                                useer.role = req.body.role;
                                useer.username = req.body.username;
                                useer.email = req.body.email;

                                useer.save((err) => {
                                    if (err) {
                                        console.log(err)
                                    }
                                    req.flash('success_msg', 'Se ha cambiado los datos de ' + user2.username);
                                    res.redirect('/admin/module/users/super')
                                })


                            } else {
                                req.flash('error_msg', 'El email ' + req.body.email + ' esta registrado en la DB');
                                res.redirect('/admin/module/user/' + req.params.id)
                            }

                        })


                    } else {
                        req.flash('error_msg', 'el username ' + req.body.username + " esta registrado en la DB");
                        res.redirect('/admin/module/user/' + req.params.id)

                    }
                })

            }


        })

    })
    .delete(security.invited, security.administrator, (req, res) => {

        async.waterfall([
                function (done) {
                    User.findById(req.params.id, (err, user) => {
                        if (err) {done(err)}

                        const imagenDelete = "./public/imagenes/" + user.avatar;
                        fs.unlink(imagenDelete, (err) => {
                            if (err) {err}
                        });

                        user.remove((err)=>{
                            if(err){done(err)}
                        });
                    });

                    Alerts.remove({user: req.params.id}, (err) => {
                        if (err) {done(err)}
                    });

                    Coment.remove({creator: req.params.id}, (err) => {
                        if (err) {done(err)}
                    });

                    Imagen.find({creator: req.params.id}, (err, imagenes) => {
                        if (err) {done(err)}

                        for(const imagen of imagenes){

                            const imagenDelete = "./public/imagenes/" + imagen.name;
                            fs.unlink(imagenDelete, (err) => {
                                if (err) {err}
                            });

                            imagen.remove((err)=>{
                                if(err){done(err)}
                            });
                        }
                    });

                    Like.remove({userLike: req.params.id}, (err) => {
                        if (err) {done(err)}
                    });

                    Report.remove({user: req.params.id}, (err) => {
                        if (err) {done(err)}
                    });

                    Suspension.remove({user: req.params.id}, (err) => {
                        if (err) {done(err)}
                    });

                    done()

                }

            ], function () {
                req.flash('success_msg', 'usuario y recursos relacionados eliminados');
                res.redirect('/admin/module/users')
            }
        )


    });

module.exports = router;