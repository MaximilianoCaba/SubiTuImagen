const express = require('express');
const router = express.Router();
const security = require("../../middleware/security");
const date = require('../../middleware/date');
const imagenService = require('../../services/imagen');
const comentarioService = require('../../services/coment');

router.route("/add/coment/:name")
    .post(date.dateNow, security.invited, security.suspension, (req, res) => {

        const cantWords = req.body.coment.split(" ");

        if (cantWords.length <= 5) {
            req.flash('error_msg', "la cantidad de palabras deben ser mayor a 6");
            res.redirect("/app/add/coment/" + req.params.name)
        } else {
            const date = req.date + " " + req.hour;
            const comentarioNuevo = {
                comentario: req.body.coment,
                creator: res.locals.user._id,
                usernameCreator: res.locals.user.username,
                datePost: date
            };
            comentarioService.agregarComentarioYsumarComentarioImagen(req.params.name, comentarioNuevo, (err) => {
                if (err) {err}
                res.redirect("/app/imagen/" + req.params.name)
            });
        }

    });

router.route('/delet/coment/:id/:imagen')
    .delete(security.invited, security.suspension, (req, res) => {

        imagenService.buscarPorId(req.params.imagen, (err, imagen) => {
            if (err) {err}
            if (imagen.creator == res.locals.user.id || security.adminOrModerator) {
                comentarioService.eliminaComentarioYrestarComentarioImagen(req.params.id, imagen, (err) => {
                    if (err) {err}
                    req.flash('success_msg', "Mensaje eliminado");
                    res.redirect("/app/imagen/" + imagen.name)
                })
            } else {
                req.flash('error_msg', "Usted no puede borrar este mensaje");
                res.redirect("/app/imagen/" + imagen.name)
            }
        })
    });


module.exports = router
