var express = require("express");
var fs = require('fs');
var router = express.Router();
var security = require("../../middleware/security");
var async = require('async');
var date = require('../../middleware/date')
var multer = require('multer');

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './public/imagenes')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        var random = Math.floor(Math.random() * 1000000000);
        cb(null, random + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
    },
});

var upload = multer({
    storage: storage,
    limits: {fileSize: 10485760}
}).single('archivo');

// Importacion de Rutas

var comentarios = require("./coment");
var like = require("./like");
var category = require("./category2");
var search = require('./search3');
var report = require('./report');
var alertas = require('./alert');

router.use(alertas);
router.use(comentarios);
router.use(like);
router.use(category);
router.use(search);
router.use(report);

// fin de importacion de rutas

// Servicios de los modelos

const imagenService = require('../../services/imagen');
const usuarioService = require('../../services/user');
const comentarioService = require('../../services/coment');
const likeService = require('../../services/like');

// fin servicio de los modelos



router.get("/imagen/new", security.suspension, security.invited, function (req, res) {
    res.render("app/imagenes/new");
});


router.get("/imagen/:name/edit", security.suspension, security.invited, function (req, res) {

    imagenService.buscarPorName(req.params.name, (err, imagen) => {
        if (err) {
            res.render(err)
        }

        if (imagen[0] == undefined) {
            res.render('404', {err: `La imagen:` + req.params.name + " no existe"})
        } else {


            if (req.user.id != imagen[0].creator) {
                req.flash('error_msg', "Usted no tiene acceso a esta peticion");
                res.redirect("/app");

            } else {

                var stringTags = imagen[0].tags.join(" ");

                res.render("app/imagenes/edit", {imagen: imagen[0], tags: stringTags})
            }
        }
    })
});


// nombro a user como useer porque entra en conflicto con la cabezera y cree que el security esta logeado
router.route("/imagen/:name")
    .get(function (req, res) {
        imagenService.buscarPorName(req.params.name, (err, image) => {
            const imagen = image[0];
            usuarioService.buscarPorId(imagen.creator, (err, usuario) => {
                comentarioService.buscarPorImagenId(imagen.id, (err, comentarios) => {

                    // esta busqueda la realizo para poder ocultar en la vista el boton Like Dislike segun lo necesite
                    if (res.locals.user != undefined) {
                        likeService.buscarPorImagenUsuario(imagen.id,res.locals.user.id,(err, userLike) => {
                            if (err) {err}
                            if (userLike.length == 1) {
                                res.render("app/imagenes/show", {
                                    imagen: imagen,
                                    coment: comentarios.reverse(),
                                    useer: usuario,
                                    userLike: userLike
                                })
                            } else {
                                res.render("app/imagenes/show", {
                                    imagen: imagen,
                                    coment: comentarios.reverse(),
                                    useer: usuario
                                })
                            }
                        })
                    } else {
                        res.render("app/imagenes/show", {imagen: imagen, coment: comentarios.reverse(), useer: usuario});
                    }

                    //Fin del ocultamiento de vista

                })
            })
        })
    })


    .put(security.invited, security.suspension, function (req, res) {
        if (req.body.title == "") {
            req.flash('error_msg', "No puede dejar en blanco el titulo de la imagen");
            res.redirect(req.params.name + "/edit");
        } else {

            imagenService.buscarPorName(req.params.name, (err, image) =>{
                if (err) {err}
                const imagen = image[0];
                if (req.user.id != imagen.creator) {
                    req.flash('error_msg', "Usted no tiene acceso a esta peticion");
                    res.redirect("/app");
                } else {
                    var tags = req.body.tags.split(" ")
                    if (tags.length < 7) {

                        imagen.title = req.body.title;
                        imagen.coment = req.body.comentImagen;
                        imagen.tags = tags;

                        imagenService.salvarImagen(imagen, (err)=>{
                            res.render("app/imagenes/" + req.params.name + "/edit");

                        });

                    } else {

                        req.flash('error_msg', "Escribe hasta 7 tags");
                        res.redirect(req.params.name + "/edit");
                    }

                }
            })
        }
    })

    .delete(security.invited, security.suspension, function (req, res) {
        imagenService.buscarPorName(req.params.name, (err, imagen)=> {
            imagenService.eliminarPorId(imagen[0]._id, (err)=> {

                if (imagen[0].creator != res.locals.user._id) {
                    if (err) {
                        console.log(err)
                    }
                    var imagenDelete = "./public/imagenes/" + req.params.name;
                    fs.unlink(imagenDelete, (err) => {
                        if (err) {
                            console.log(err)
                        }
                    });
                    comentarioService.eliminarPorImagen(imagen[0]._id, (errors)=> {
                        if (errors) {
                            req.flash('error_msg', "No se pudo borrar la imagen de nuestra DB");
                            res.redirect("/app/imagenes");
                        }
                        req.flash('success_msg', "La imagen ha sido borrada");
                        res.redirect("/app/imagenes");
                    })
                } else {
                    console.log("No puedes borrar una imagen de otro usario");
                }
            })
        })
    });

router.route("/imagenes")
    .get(security.invited, function (req, res) {
        imagenService.buscarPorUsuario(res.locals.user._id, (err, imagenes)=> {
            if (err) {
                res.redirect("/app");
                return;
            }
            res.render("app/imagenes/index", {imagenes: imagenes})
        })
    })
    .post(date.dateNow, security.invited, security.suspension, function (req, res) {

        async.waterfall([

                function (done) {

                    upload(req, res, (err) => {

                        if (err) {

                            req.flash('error_msg', "El tamaño de la imagen supera los 10 Mb permitidos");

                        }
                        var imagen = req.file;

                        if (imagen == undefined) {
                            req.flash('error_msg', "Debe elegir una imagen");
                            res.redirect("imagen/new")

                        } else {


                            if (req.body.title == "") {

                                var imagenDelete = "./public/imagenes/" + imagen.filename;
                                fs.unlink(imagenDelete, (err) => {
                                    if (err) {
                                        console.log(err)
                                    }
                                    req.flash('error_msg', "El titulo esta vacio")
                                    res.redirect("imagen/new");

                                })

                            } else {
                                var tags = req.body.tags.split(" ");

                                if (tags.length > 7) {

                                    var imagenDelete = "./public/imagenes/" + imagen.filename;
                                    fs.unlink(imagenDelete, (err) => {
                                        if (err) {
                                            console.log(err)
                                        }

                                        req.flash('error_msg', "El titulo esta vacio")
                                        res.redirect("imagen/new");

                                    })
                                } else {

                                    var extension = imagen.mimetype.split("/").pop();

                                    if (extension !== "jpg" && extension !== "png" &&
                                        extension !== "bmp" && extension !== "jpeg" &&
                                        extension !== "gif" && extension !== "tif" &&
                                        extension !== "JPG" && extension !== "PNG" &&
                                        extension !== "BMP" && extension !== "JPEG" &&
                                        extension !== "GIF" && extension !== "TIF") {

                                        var imagenDelete = "./public/imagenes/" + imagen.filename;
                                        fs.unlink(imagenDelete, (err) => {
                                            if (err) {
                                                console.log(err)
                                            }

                                            req.flash('error_msg', "Formato de Imagen no valido");
                                            res.redirect("imagen/new");

                                        })
                                    } else {

                                        var nuevaImagen = {
                                            title: req.body.title,
                                            creator: res.locals.user._id,
                                            coment: req.body.comentImagen,
                                            name: imagen.filename,
                                            extension: extension,
                                            dateupload: req.date,
                                            hourupload: req.hour,
                                            cantComents: 0,
                                            likes: 0,
                                            category: req.body.category,
                                            countVisit: 0,
                                            tags: req.body.tags.split(" ")
                                        };

                                        imagenService.salvarImagen(nuevaImagen, (err)=>{
                                            if(err){err}
                                            done(nuevaImagen);
                                        })
                                    }
                                }
                            }
                        }
                    })

                }], function (nuevaImagen) {

                res.redirect("/app/imagen/" + nuevaImagen.name)
            }
        )
    });

router.route('/imagenes/:user')
    .get(security.invited, security.suspension, (req, res) => {



        imagenService.buscarPorUsuario(req.params.user, (err, imagenes) => {
            if (err) {err}
            res.render("app/imagenes/usergalery", {imagenes: imagenes})
        })

    });

module.exports = router;