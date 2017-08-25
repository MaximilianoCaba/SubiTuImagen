var express = require('express');
var router = express.Router();
var security = require('../../middleware/security')
var date = require('../../middleware/date')

const reportService = require('../../services/report');
const imagenService = require('../../services/imagen');

router.route('/imagen/report/:id')
    .get(security.invited, security.suspension, (req, res) => {

        res.render('app/imagenes/report/imagen', {imagen: req.params.id})

    })
    .post(date.dateNow, security.suspension, (req, res) => {

        // solucion para el ingreso por teclado de espacios en blanco
        var comentarios = req.body.coment.split(" ");

        for (var comentario of comentarios) {
            if (comentario == "") {
                comentarios.splice(comentario)
            }
        }
        // si el array esta en cero es porque eran todos espacios en blanco

        if (comentarios.length == 0) {

            req.flash('error_msg', 'Por favor aclare con un comentario cual es el motivo de la denuncia');
            res.redirect('/app/imagen/report/' + req.params.id)

        } else {

            var nuevoReporte = {
                coment: req.body.coment,
                user: res.locals.user._id,
                image: req.params.id,
                date: req.date,
                hour: req.hour,
                motive: req.body.motive,

            };

            reportService.crearReporte(nuevoReporte, (err)=>{
                if(err){err}
                req.flash('success_msg', 'la denuncia ah sido realizada, sera revisada por un admin a la brevedad');
                res.redirect('/')

            })

        }

    })

    .delete((req, res) => {
        reportService.eliminarReporte(req.params.id, (err) => {
            if (err) {err}
            res.redirect('/user/perfil')
        })
    });


router.route('/imagen/coment/report/:comentId/:imagenId')
    .get(security.invited, security.suspension, (req, res) => {

        res.render('app/imagenes/report/coment', {comentId: req.params.comentId, imagenId: req.params.imagenId})

    })
    .post(date.dateNow, security.invited, security.suspension, (req, res) => {


        imagenService.buscarPorId(req.params.imagenId, (err, imagen)=>{

            var report = {

                coment: req.body.coment,
                user: res.locals.user.id,
                image: req.params.imagenId,
                comentario: req.params.comentId,
                date: req.date,
                hour: req.hour,
                motive: req.body.motive

            };

            reportService.crearReporte(report, (err)=>{
                if(err){err}
                req.flash('success_msg', 'Denuncia enviada con exito');
                res.redirect('/app/imagen/' + imagen.name)
            })

        });

    });

module.exports = router
