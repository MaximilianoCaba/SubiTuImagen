var express = require('express');
var router = express.Router();
var security = require('../../middleware/security')
var Reports = require('../../models/report')
var User = require('../../models/user')
var date = require('../../middleware/date')
var Alert = require('../../models/alert')
var async = require('async')

router.route('/global/alert')
    .get(security.invited, security.administrator, (req, res) => {
        res.render('admin/alert/global')
    })
    .post(security.invited, security.administrator, date.dateNow, (req, res) => {

        async.waterfall([

                function (done) {

                    User.find({}, (err, users) => {

                        for (var usuario of users) {

                            var newAlert = new Alert({
                                message: req.body.message,
                                user: usuario.id,
                                date: req.date,
                                hour: req.hour,
                            });
                                newAlert.save((err) => {
                                if (err) {err}
                            });


                            var cont = usuario.alerts + 1;
                            usuario.alerts = cont;
                            usuario.save((err) => {
                                if (err) {err}
                            })

                        }
                        done()
                    })

                }
            ], function () {
                req.flash('success_msg', 'El alerta ha sido enviada a todos los usuarios')
                res.redirect("/admin/module");
            }
        )

    })

module.exports = router


