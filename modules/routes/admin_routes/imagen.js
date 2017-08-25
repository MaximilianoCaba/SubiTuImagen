var express = require('express');
var router = express.Router();
var security = require('../../middleware/security')
var Reports = require('../../models/report')
var Coments = require('../../models/coment')
var Imagen = require('../../models/imagen')
var async = require('async');
var fs = require('fs')
var date = require('../../middleware/date');
var Alert = require('../../models/alert')
var User = require('../../models/user');
var Suspension = require('../../models/suspension')


router.route('/imagen/delete/:id')
    .get(security.invited, security.adminOrModerator, (req, res) => {

        res.render('admin/delete/imagen', {id: req.params.id})

    })

    .delete(date.dateNow, security.invited, security.adminOrModerator, (req, res) => {

        async.waterfall([

                function (done) {

                    Imagen.findById(req.params.id, function (err, imagen) {
                        console.log(req.body.date)

                        var nombre = imagen.name
                        var usuario = imagen.creator
                        var title = imagen.title

                        Imagen.findByIdAndRemove(imagen.id, function (err) {
                            if (err) {
                                err
                            }

                            var imagenDelete = "./public/imagenes/" + nombre
                            fs.unlink(imagenDelete, (err) => {
                                if (err) {
                                    console.log(err)
                                }
                            })
                            Coments.remove({image: req.params.id}, (errors) => {
                                if (errors) {
                                    req.flash('error_msg', "No se pudo borrar la imagen de nuestra DB")
                                    res.redirect("/app/imagenes");
                                }

                                Reports.remove({image: req.params.id}, (err) => {
                                    if (err) {
                                        err
                                    }

                                    if (req.body.date == undefined) {

                                        var newAlert = new Alert({
                                            message: "La imagen " + title + " ha sido eliminada por el motivo " +
                                            req.body.motive + "  Aclaracion adicional: " + req.body.aclaration,
                                            user: usuario,
                                            date: req.date,
                                            hour: req.hour,
                                        })

                                        User.findById(usuario, (err, user) => {
                                            if (err) {
                                                err
                                            }

                                            var cont = user.alerts + 1
                                            user.alerts = cont
                                            user.save((err) => {
                                                if (err) {
                                                    err
                                                }

                                                var alert = new Alert(newAlert);
                                                alert.save((err) => {
                                                    if (err) {
                                                    }

                                                    done()
                                                })

                                            })

                                        })
                                    } else {

                                        var newSusp = new Suspension({
                                            coment: "La imagen " + title + " ha sido eliminada por el motivo " +
                                            req.body.motive + "  Aclaracion adicional: " + req.body.aclaration,
                                            user: usuario,
                                            date: req.date,
                                            dateSuspension: req.body.date
                                        })

                                        newSusp.save((err) => {
                                            if (err) {
                                                err
                                            }
                                            done()
                                        })

                                    }

                                })

                            })

                        })
                    })
                }

            ], function () {

                req.flash('success_msg', "La imagen ha sido borrada")
                res.redirect("/admin/module/reports");
            }
        )

    })

router.route('/imagen/reject/:id')
    .get(security.invited, security.adminOrModerator, (req, res) => {

        Imagen.findById(req.params.id, (err, imagen) => {
            if (err) {
                err
            }

            res.render('admin/alert/user', {imagen})

        })

    })

    .post(date.dateNow, security.invited, security.adminOrModerator, (req, res) => {

        async.waterfall([

                function (done) {

                    Imagen.findById(req.params.id, (err, imagen) => {
                        if (err) {
                            err
                        }

                        var newAlert = new Alert({
                            message: "La imagen " + imagen.title + " ha sido eliminada por el motivo " +
                            req.body.motive + "  Aclaracion adicional: " + req.body.aclaration,
                            user: imagen.creator,
                            date: req.date,
                            hour: req.hour,
                        })

                        User.findById(imagen.creator, (err, user) => {
                            if (err) {
                                err
                            }

                            var cont = user.alerts + 1
                            user.alerts = cont

                            user.save((err) => {
                                if (err) {
                                    err
                                }

                                Reports.remove({image: req.params.id}, (err) => {
                                    if (err) {
                                        err
                                    }

                                    var alert = new Alert(newAlert);
                                    alert.save((err) => {
                                        if (err) {
                                            err}

                                        done()

                                    })
                                })
                            })
                        })
                    })

                }
            ], function () {

            req.flash('success_msg', "Reportes eliminados y alerta enviada")
            res.redirect("/admin/module/reports");
            }
        )
    })

module.exports = router