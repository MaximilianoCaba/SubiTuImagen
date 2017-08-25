var express = require('express');
var router = express.Router();
var imagenService = require('../../services/imagen')

router.route('/imagenes/search')
    .post( (req, res) => {

        var tagsList = req.body.tags.split(" ")

        if (tagsList.length >= 5 || tagsList == "") {
            req.flash("error_msg", "por favor escriba al menos 1 tag o 5 tags maximo")
            res.redirect("/")
        } else {

            imagenService.buscarPorTags(tagsList, (err, imagenes)=>{

                if (imagenes[0] != undefined) {
                    res.render('app/home', {imagenes: imagenes})
                } else {

                    req.flash("error_msg", "No se han encontrado imagenes similares")
                    res.redirect("/")
                }

            })

        }
    })

module.exports = router