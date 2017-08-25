var express = require('express');
var router = express.Router();
var Imagen = require("../../../models/imagen");
var async = require('async');

router.route('/imagenes/search')
    .post( (req, res) => {

        var tagsList = req.body.tags.split(" ")

        if (tagsList.length >= 5 || tagsList == "") {

            req.flash("error_msg", "por favor escriba al menos 1 tag o 5 tags maximo")
            res.redirect("/")

        } else {

            async.waterfall([

                function (done) {

                    var imagenesSearch = new Array();

                    Imagen.find({}, (err, imagenes) => {

                        if (err) {
                            err
                        }

                        for (var imagen of imagenes) {

                            for (var tagList of tagsList) {

                                if (imagen.tags != undefined) {

                                    var tags = imagen.tags.split(" ");

                                    for (var tag of tags) {

                                        if (tag == tagList) {

                                            imagenesSearch.push(imagen)
                                        }
                                    }

                                }
                            }
                        }

                        var resultado = imagenesSearch.filter(function(elem, index, self) {
                            return index == self.indexOf(elem);
                        })
                        done(resultado)

                    })

                }

            ], function (resultado) {

                if (resultado[0] != undefined) {

                    res.render('app/home', {imagenes: resultado})

                } else {

                    req.flash("error_msg", "No se han encontrado imagenes similares")
                    res.redirect("/")
                }

            })

        }

    })

module.exports = router
