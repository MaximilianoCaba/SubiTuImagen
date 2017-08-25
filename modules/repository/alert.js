const Alert = require('../models/alert')

eliminarAlertaId = (alertaId, callback)=>{
    Alert.remove({_id: alertaId}, callback);
};

buscarPorUsuario = (usuarioId, callback)=>{
    Alert.find({user: usuarioId}, callback);
};

module.exports = {
    eliminarAlertaId,
    buscarPorUsuario,
};
