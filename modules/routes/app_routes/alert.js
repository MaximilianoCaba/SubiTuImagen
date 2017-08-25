var express = require('express');
var router = express.Router();

const alertaService = require('../../services/alert');

router.route('/imagen/alert/:id')
    .delete((req, res) => {

        const alertaId = req.params.id;
        const usuarioLocalId = res.locals.user.id;
        alertaService.eliminarAlerta(alertaId, usuarioLocalId, (err) => {
            if (err) {err}
            res.redirect('/user/perfil')
        })

    });

module.exports = router;