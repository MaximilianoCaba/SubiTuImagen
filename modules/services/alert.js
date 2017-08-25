const alertaRepository = require('../repository/alert');
const usuarioService = require('../services/user');

eliminarAlerta = (alertaId, usuarioLocalId, callback)=>{

    alertaRepository.eliminarAlertaId(alertaId, (err)=>{
        if(err){err}

        usuarioService.buscarPorId(usuarioLocalId, (err, usuario)=>{

            const cont = usuario.alerts - 1;

            usuario.alerts = cont;

            usuarioService.salvarUsuario(usuario, callback);

        })
    })

};

module.exports = {
    eliminarAlerta
};