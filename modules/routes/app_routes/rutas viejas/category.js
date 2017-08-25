var express = require('express');
var router = express.Router();
var Imagen = require('../../../models/imagen');
var categorias = require('../../../models/enum/categorias')
var async = require('async');


router.route('/imagenes/category/:category')
    .get((req, res) => {

        async.waterfall([

            function (done) {
                var flag = 0

                for (var cat of categorias) {
                    if (cat == req.params.category) {
                        flag = 1
                    }
                }

                if (flag == 1) {

                    Imagen.find({category: req.params.category}, (err, imagenes) => {
                        if (err) {err}

                        if (imagenes[0] == undefined) {

                            res.render('404', {err: "Perdon, nos sentimos avergonzados, pero esta categoria no tiene imagenes"})

                        } else {
                            done(err, imagenes)
                        }
                    })

                } else {
                    res.render('404', {err: "No se encontro la categoria solicitada"})
                }
            }


        ], function (err, imagenes) {
            if (err) {
                err
            }

            res.render('app/imagenes/category', {imagenes: imagenes.reverse(), category: req.params.category})



        })


    })

router.route('/imagenes/category/like/:category')
    .get((req, res) => {

        Imagen.find({category: req.params.category}, (err, imagenes) => {
            if (err) {
                console.log(err)
            }

            var now = new Date();
            var month = now.getMonth() + 1;
            var year = now.getFullYear();

            var imagenesHot = new Array();

            for (var imagen of imagenes) {

                var dayImagen = parseInt(imagen.dateupload.split("/").slice(0, -2).pop())
                var monthImagen = parseInt(imagen.dateupload.split("/").slice(0, -1).pop())
                var yearImagen = parseInt(imagen.dateupload.split("/").pop())

                var newDay = dayImagen + 2
                var newMonth = monthImagen + 1

                if (newDay <= 28 && month == monthImagen && year == yearImagen) {
                    imagenesHot.push(imagen)
                } else {
                    if (newDay == 29 && month == 2 && year % 4 == 0 && month == monthImagen && year == yearImagen) {
                        imagenesHot.push(imagen)
                    } else {
                        if (newDay == 29 && month != 2 && month == monthImagen && year == yearImagen) {
                            imagenesHot.push(imagen)
                        } else {
                            if (newDay == 30 && month == monthImagen && year == yearImagen) {
                                if (month == 4 || month == 6 || month == 9 || month == 11) {
                                    imagenesHot.push(imagen)
                                } else {
                                    if (newDay == 31 && month == monthImagen && year == yearImagen) {
                                        if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
                                            imagenesHot.push(imagen)
                                        } else {
                                            if (newDay == 32 || newDay == 33 || newDay == 34) {
                                                if (newMonth <= 12 && month == newMonth && year == yearImagen) {
                                                    imagenesHot.push(imagen)
                                                } else {
                                                    if (newMonth == 13) {
                                                        if (month == 1 && year == (yearImagen + 1)) {
                                                            imagenesHot.push(imagen)
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            function compare(a, b) {
                if (a.likes < b.likes)
                    return -1;
                if (a.likes > b.likes)
                    return 1;
                return 0;
            }

            console.log(imagenesHot.sort(compare))

            res.render('app/imagenes/category/category', {imagenes: imagenesHot.reverse()})
        })
    })


router.route('/imagenes/category/coment/:category')
    .get((req, res) => {

        Imagen.find({category: req.params.category}, (err, imagenes) => {
            if (err) {
                console.log(err)
            }

            var now = new Date();
            var month = now.getMonth() + 1;
            var year = now.getFullYear();

            var imagenesHot = new Array();

            for (var imagen of imagenes) {

                var dayImagen = parseInt(imagen.dateupload.split("/").slice(0, -2).pop())
                var monthImagen = parseInt(imagen.dateupload.split("/").slice(0, -1).pop())
                var yearImagen = parseInt(imagen.dateupload.split("/").pop())

                var newDay = dayImagen + 2
                var newMonth = monthImagen + 1

                if (newDay <= 28 && month == monthImagen && year == yearImagen) {
                    imagenesHot.push(imagen)
                } else {
                    if (newDay == 29 && month == 2 && year % 4 == 0 && month == monthImagen && year == yearImagen) {
                        imagenesHot.push(imagen)
                    } else {
                        if (newDay == 29 && month != 2 && month == monthImagen && year == yearImagen) {
                            imagenesHot.push(imagen)
                        } else {
                            if (newDay == 30 && month == monthImagen && year == yearImagen) {
                                if (month == 4 || month == 6 || month == 9 || month == 11) {
                                    imagenesHot.push(imagen)
                                } else {
                                    if (newDay == 31 && month == monthImagen && year == yearImagen) {
                                        if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
                                            imagenesHot.push(imagen)
                                        } else {
                                            if (newDay == 32 || newDay == 33 || newDay == 34) {
                                                if (newMonth <= 12 && month == newMonth && year == yearImagen) {
                                                    imagenesHot.push(imagen)
                                                } else {
                                                    if (newMonth == 13) {
                                                        if (month == 1 && year == (yearImagen + 1)) {
                                                            imagenesHot.push(imagen)
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            function compare(a, b) {
                if (a.cantComents < b.cantComents)
                    return -1;
                if (a.cantComents > b.cantComents)
                    return 1;
                return 0;
            }

            console.log(imagenesHot.sort(compare))
            res.render('app/imagenes/category/category', {imagenes: imagenesHot.reverse()})
        })
    })


module.exports = router