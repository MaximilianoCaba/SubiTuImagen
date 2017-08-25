var express = require('express');
var router = express.Router();
var Imagen = require('../../models/imagen');
var categorias = require('../../models/enum/categorias')
var async = require('async');
var date = require('../../middleware/date');

const imagenService = require('../../services/imagen')


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
                    imagenService.buscarPorCategoria(req.params.category, (err, imagenes) => {
                        if (err) {err}
                        if (imagenes[0] == undefined) {
                            res.render('err/404', {err: "Perdon, nos sentimos avergonzados, pero esta categoria no tiene imagenes"})
                        } else {
                            done(err, imagenes)
                        }
                    })
                } else {
                    res.render('err/404', {err: "No se encontro la categoria solicitada"})
                }
            }
        ], function (err, imagenes) {
            if (err) {err}
            res.render('app/imagenes/category', {imagenes: imagenes.reverse(), category: req.params.category})
        })
    });

router.route('/imagenes/category/like/:category')
    .get(date.lastdays, (req, res) => {
        imagenService.buscar7diasOrdenadoPorLikes(req.params.category, req.last7days, (err, imagenes) => {
            res.render('app/imagenes/category/category', {imagenes: imagenes})
        })
    });

router.route('/imagenes/category/coment/:category')
    .get(date.lastdays, (req, res) => {
        imagenService.buscar7diasOrdenadoPorComentarios(req.params.category, req.last7days, (err, imagenes) => {
            res.render('app/imagenes/category/category', {imagenes: imagenes})
        })
    });

module.exports = router;