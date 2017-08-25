var express = require('express');
var router = express.Router();
var security = require('../../middleware/security')
var Suspension = require('../../models/suspension')

router.route('/suspensions')
    .get(security.invited ,security.adminOrModerator, (req, res) => {

        Suspension.find({}).populate('user').exec( (err, suspensions)=> {
            if(err){err}

            res.render('admin/suspensions',{suspensions})
        })

    })

router.route('/suspension/:id')
    .get(security.invited ,security.adminOrModerator, (req, res) =>{
        Suspension.findById(req.params.id).populate('user').exec((err, suspension)=>{
            if(err){err}
            res.render('admin/suspensions/suspension', {suspension})
        })
    })
    .delete(security.invited ,security.adminOrModerator, (req, res) =>{
        Suspension.findById(req.params.id,(err, suspension)=>{
            if(err){err}
        var susp = suspension
            susp.remove((err)=>{
                if(err){err}

                req.flash('success_msg', 'Suspension eliminada con exito')
                res.redirect('/admin/module/suspensions')

            })

        })

    });

router.route('/suspension/edit/:id')
    .get(security.invited ,security.adminOrModerator, (req, res) =>{
        Suspension.findById(req.params.id).populate('user').exec((err, suspension)=>{
            if(err){err}
            res.render('admin/suspensions/edit', {suspension})
        })
    })

    .put(security.invited ,security.adminOrModerator, (req, res) =>{

        Suspension.findById(req.params.id).populate('user').exec((err, suspension)=>{
            if(err){err}

            suspension.dateSuspension = req.body.date
            var susp = new Suspension(suspension)
            susp.save((err)=>{
                if(err){err}
                res.redirect('/admin/module/suspension/' + req.params.id)

            })
        })
    })

module.exports = router