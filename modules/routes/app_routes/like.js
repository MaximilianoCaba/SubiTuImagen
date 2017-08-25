var express = require('express');
var router = express.Router();
var Imagen = require('../../models/imagen');
var Like = require('../../models/like');
var security = require("../../middleware/security");

const imagenService = require('../../services/imagen');
const likeService = require('../../services/like');


router.route('/imagen/like/:name')
    .post(security.invited, security.suspension, (req, res) => {
        imagenService.buscarPorName(req.params.name, (err, imagen) => {
            if (err) {
                err
            }
            const imageName = imagen[0].name;
            const imagenId = imagen[0]._id;

            likeService.buscarPorImagenUsuario(imagen[0]._id, res.locals.user._id, (err, like) => {
                if (err) {err}
                if (like[0] != undefined) {

                    req.flash('error_msg', 'No puedes dar Like mas de una vez');
                    res.redirect("/app/imagenes/" + imageName)
                } else {
                    const nuevoLike = {
                        userLike: res.locals.user._id,
                        image: imagenId
                    };

                    likeService.salvarLike(nuevoLike, (err) => {
                        if (err) {err}

                        imagenService.sumarLike(imageName, (err)=>{
                            if(err){err}
                            req.flash('success_msg', 'Gracias por tu Like!');
                            res.redirect("/app/imagen/" + imageName)
                        })

                    })
                }
            })
        })
    });

router.route('/imagen/dislike/:name')
    .post(security.invited, security.suspension, (req, res) => {
        imagenService.buscarPorName(req.params.name, (err, imagen) => {
            if (err) {err}
            var imagenId = imagen[0]._id;
            var imageName = imagen[0].name;
            likeService.buscarPorImagenUsuario(imagenId, res.locals.user._id, (err, like) => {
                if (err) {err}
                if (like[0] == undefined) {
                    req.flash('error_msg', 'No puede votar negativamente');
                    res.redirect("/app/imagen/" + imageName)
                } else {
                    likeService.eliminarLike(like[0], (err) => {
                        if (err) {err}
                        imagenService.restarLike(req.params.name, (err) => {
                            if(err){err}
                            req.flash('success_msg', 'Like eliminado');
                            res.redirect("/app/imagen/" + imageName)
                        })
                    })
                }
            })
        })
    });

module.exports = router

