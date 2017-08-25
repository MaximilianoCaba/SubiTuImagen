var express = require('express');
var router = express.Router();
var security = require('../../middleware/security')
var Reports = require('../../models/report')
var Imagen = require('../../models/imagen')
var async = require('async');
var fs = require('fs')
var Alert = require('../../models/alert');
var User = require('../../models/user');
var date = require('../../middleware/date');
var Suspension = require('../../models/suspension');
var Coment = require('../../models/coment')


router.route('/reports')
    .get(security.invited, security.adminOrModerator, (req, res) => {

        async.waterfall([

                function (done) {

                    Reports.find({}).populate("image").exec((err, reports) => {
                        if (err) {
                            err
                        }

                        var imagenes = new Array();

                        for (var report of reports) {

                            imagenes.push(report.image)
                        }

                        var resultado = imagenes.filter(function (elem, index, self) {
                            return index == self.indexOf(elem);
                        })

                        done(resultado)
                    })
                }
            ], function (resultado) {

                if (resultado.length == 0) {
                    res.render('admin/report', {mensaje: "No hay imagenes reportadas en este momento"})

                } else {


                    res.render('admin/report', {reports: resultado})

                }

            }
        )
    })


router.route('/report/:id')
    .get(security.invited, security.adminOrModerator, (req, res) => {

        Reports.find({image: req.params.id}).populate('user').populate('comentario').exec((err, reports) => {
            if (err) {
                err
            }
            Imagen.findById(req.params.id, (err, imagen) => {
                if (err) {
                    err
                }
                res.render('admin/report/report', {reports: reports, imagen: imagen})
            })
        })

    })

router.route('/report/delete/:id')
    .get(security.invited, security.adminOrModerator, (req, res) => {

        res.render('admin/delete/report/report', {id: req.params.id})

    })

    .delete(date.dateNow, security.invited, security.adminOrModerator, (req, res) => {

        Reports.findById(req.params.id).populate('image').exec((err, report) => {

            var nombreImagen = report.image.title;
            var motive = report.motive;
            var coment = report.coment;
            var dateReport = report.date;
            var usuario = report.user;
            console.log(res.locals.user.id)

            Reports.remove({_id: req.params.id}, (err) => {
                if (err) {
                    err
                }

                if (req.body.date == undefined) {

                    var newAlert = new Alert({
                        message: "Su denuncia a la imagen: [" + nombreImagen + "] con el motivo: [" +
                        motive + "] y comentario: [" + coment + "] en el dia: [" + dateReport +
                        "] ha sido desestimada por la siguiente razon: [" + req.body.aclaration + "]",

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
                                    err
                                }


                                req.flash('success_msg', 'Reporte eliminado y notificacion enviada')
                                res.redirect('/admin/module/reports')

                            })

                        })

                    })

                } else {

                    var newSusp = new Suspension({
                        coment: "La imagen [" + nombreImagen + "] ha sido eliminada por el motivo [" +
                        motive + "]  Aclaracion adicional: [" + coment + "]",
                        user: usuario,
                        date: req.date,
                        dateSuspension: req.body.date
                    })

                    newSusp.save((err) => {
                        if (err) {
                            err
                        }
                        req.flash('success_msg', 'Reporte eliminado y suspension emitida')
                        res.redirect('/admin/module/reports')
                    })
                }
            })
        })
    })


router.route('/report/delete/coment/:id')
    .get(security.invited, security.adminOrModerator, (req, res) => {

        res.render('admin/delete/report/coment', {id: req.params.id})

    })

    .delete(date.dateNow, security.invited, security.adminOrModerator, (req, res) => {

        Reports.findById(req.params.id).populate('image').populate('comentario').exec((err, report) => {

            var condicion = req.body.eliminar;

            if (condicion == "no") {


                var comentario = report.comentario.comentario;
                var motive = report.motive;
                var coment = report.coment;
                var dateReport = report.date;
                var usuario = report.user;

                Reports.remove({_id: req.params.id}, (err) => {
                    if (err) {
                        err
                    }

                    if (req.body.date == undefined) {

                        var newAlert = new Alert({
                            message: "Su denuncia al comentario: [" + comentario + "] con el motivo: [" +
                            motive + "] y aclaracion: [" + coment + "] en el dia: [" + dateReport +
                            "] ha sido desestimada por la siguiente razon: [" + req.body.aclaration + "]",

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
                                        err
                                    }


                                    req.flash('success_msg', 'Reporte eliminado y notificacion enviada')
                                    res.redirect('/admin/module/reports')

                                })

                            })

                        })

                    } else {

                        var newSusp = new Suspension({
                            coment: "El comentario [" + comentario + "] ha sido eliminada por el motivo [" +
                            motive + "]  Aclaracion adicional: [" + coment + "]",
                            user: usuario,
                            date: req.date,
                            dateSuspension: req.body.date
                        })

                        newSusp.save((err) => {
                            if (err) {
                                err
                            }
                            req.flash('success_msg', 'Reporte eliminado y suspension emitida')
                            res.redirect('/admin/module/reports')
                        })
                    }
                })
            } else {

                var comentario = report.comentario.comentario;
                var motive = report.motive;
                var coment = report.coment;
                var dateReport = report.date;
                var usuario = report.user;

                Reports.remove({_id: req.params.id}, (err) => {
                    if (err) {
                        err
                    }

                    if (req.body.date == undefined) {

                        var newAlert = new Alert({
                            message: "Su comentario [" + comentario + "] ha sido borrado por el motivo [" +
                            motive + "] y aclaracion: [" + coment + "] en el dia: [" + dateReport +
                            "] por la siguiente razon: [" + req.body.aclaration + "]",

                            user: report.comentario.creator,
                            date: req.date,
                            hour: req.hour,
                        })

                        User.findById(report.comentario.creator, (err, user) => {
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
                                        err
                                    }

                                    Coment.remove({id: report.comentario.id}, (err) => {
                                        if (err) {
                                            err
                                        }
                                        req.flash('success_msg', 'Reporte, Mensaje eliminado y notificacion enviada')
                                        res.redirect('/admin/module/reports')
                                    })


                                })

                            })

                        })

                    } else {

                        var newSusp = new Suspension({
                            coment: "El comentario [" + comentario + "] ha sido eliminada por el motivo [" +
                            motive + "]  Aclaracion adicional: [" + coment + "]",
                            user: report.comentario.creator,
                            date: req.date,
                            dateSuspension: req.body.date
                        })

                        newSusp.save((err) => {
                            if (err) {
                                err
                            }

                            Coment.remove({id: report.comentario.id}, (err) => {
                                if (err) {
                                    err
                                }
                                req.flash('success_msg', 'Reporte, Mensaje eliminado y suspension emitida')
                                res.redirect('/admin/module/reports')
                            })

                        })
                    }
                })


            }
        })

    })


module.exports = router