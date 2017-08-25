var express = require('express');
var router = express.Router();
var security = require('../../middleware/security')
var Reports = require('../../models/report')
var User = require('../../models/user');
var Suspension = require('../../models/suspension')


var user = require('./user');
var report = require('./report');
var imagen = require('./imagen');
var alert = require('./alert');
var suspensions = require('./suspension')

router.use(user);
router.use(report);
router.use(imagen);
router.use(alert);
router.use(suspensions);


router.route('/')
    .get(security.invited, security.adminOrModerator, (req, res) => {

        Reports.find({}, (err, reports) => {

            var cantReports = reports.length;

            User.find({role: "admin_role"}, (err, admins) => {
                var cantAdmins = admins.length

                User.find({role: "moderator_role"}, (err, moderators) => {
                    var cantModerators = moderators.length

                    Suspension.find({}, (err, suspensions) => {
                        var cantSuspension = suspensions.length

                        User.find({}, (err, user) => {

                            var cantUsuarios = user.length
                            res.render('admin', {cantReports, cantAdmins, cantModerators, cantSuspension, cantUsuarios})
                        })
                    })
                })
            })
        })
    })

module.exports = router