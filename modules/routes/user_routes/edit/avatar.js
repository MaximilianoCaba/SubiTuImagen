var express = require('express');
var router = express.Router();
var User = require('../../../models/user');
var fs = require('fs');
var security = require("../../../middleware/security");
var async = require('async');

var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/avatar')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        var random = Math.floor(Math.random() * 10000000000);
        cb(null, random + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
    },
});

var upload = multer({
    storage: storage,
    limits: {fileSize: 1048576}
}).single('archivo');


const avatarRepository = require('../../../services/user_routes/edit/avatar')

router.route("/edit/avatar/:id")
    .get(security.invited, security.unauthorized, security.suspension, (req, res) => {
        avatarRepository.verAvatarPorId(req.params.id, (err, usuario)=>{
            if(err){err}
            res.render("user/edit/avatar", {user: usuario})
        });
    })
    .put(security.suspension, (req, res) => {

        async.waterfall([

                function (done) {

                    if (req.user.id != req.params.id) {

                        req.flash('error_msg', "Usted no tiene acceso a esta peticion")
                        res.redirect("/app");

                    } else {


                        upload(req, res, (err) => {
                            if (err) {
                                req.flash("error_msg", "EL archivo debe ser menor a 1 MB")
                            }

                            var avatar = req.file

                            if (avatar == undefined) {
                                req.flash("error_msg", "No selecciono ninguna imagen")
                                res.redirect("/user/edit/avatar/" + req.params.id)

                            } else {

                                var extension = avatar.mimetype.split("/").pop();

                                if (extension !== "jpg" && extension !== "png" &&
                                    extension !== "bmp" && extension !== "jpeg" &&
                                    extension !== "gif" && extension !== "tif" &&
                                    extension !== "JPG" && extension !== "PNG" &&
                                    extension !== "BMP" && extension !== "JPEG" &&
                                    extension !== "GIF" && extension !== "TIF") {

                                    var imagenDelete = "./public/avatar/" + avatar.filename
                                    fs.unlink(imagenDelete, (err) => {
                                        if (err) {
                                            console.log(err)
                                        }

                                        req.flash('error_msg', "Formato de Imagen no valido")
                                        res.redirect("/user/edit/avatar/" + req.params.id);

                                    })

                                } else {
                                    if (res.locals.user.avatar != "avatar.jpg") {
                                        var imagenDelete = "./public/avatar/" + res.locals.user.avatar

                                        fs.unlink(imagenDelete, (err) => {
                                            if (err) {
                                                console.log(err)
                                            }
                                        })

                                        var avatar = req.file.filename
                                    } else {
                                        var avatar = req.file.filename
                                    }
                                }

                                User.findById(req.params.id, (err, user) => {
                                    if (err) {
                                        console.log(err)
                                    }
                                    user.avatar = avatar;
                                    user.save((err) => {
                                        if (err) {
                                            res.redirect(req.params.id)
                                        }
                                        done()
                                    })
                                })
                            }

                        })
                    }
                }

            ], function () {
                res.redirect('/user/perfil');
            }
        )

    })

module.exports = router