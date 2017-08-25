const express = require('express');
const router = express.Router();
const security = require("../../middleware/security");

const perfilService = require('../../services/user_routes/perfil');


router.route("/perfil")
    .get(security.invited, (req, res) => {
        perfilService.verPerfilPersonal(res.locals.user.id, (err, alerta, usuario)=>{
            if(err){err}
            res.render("user/perfil", {usuario: usuario, alerts: alerta})
        });

    });

router.route("/perfil/:id")
    .get((req, res) => {
        perfilService.verPerfilPorId(req.params.id, (error, array) => {
            if (error == "usuario no existe") {
                res.render('404', {err: `El usuario con id:` + req.params.id + " no existe"})

            } else {
                res.render("user/userperfil", {
                    usuario: array.usuario,
                    cantLikes: array.cantLikes,
                    coments: array.comentarios,
                    cantComents: array.cantComents
                })
            }
        });
    });

router.route('/desvincular/fb/:id')
    .post(security.invited, security.unauthorized, (req, res) => {
        perfilService.desvincularFacebook(req.params.id, (err) => {
            if (err) {err}
            req.flash("success_msg", "Tu cuenta de Facebook ha sido desvinculada Con Exito");
            res.redirect("/user/perfil");
        });
    });

router.route('/desvincular/google/:id')
    .post(security.invited, security.unauthorized, (req, res) => {
        perfilService.desvincularGoogle(req.params.id, (err) => {
            if (err) {err}
            req.flash("success_msg", "Tu cuenta de Google ha sido desvinculada Con Exito");
            res.redirect("/user/perfil");
        });
    });

module.exports = router