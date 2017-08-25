const User = require('../models/user');

buscarPorId = (usuarioId, callback)=>{
    User.findById(usuarioId, callback);
};

salvarUsuario = (usuario, callback)=>{
    var usuarioSave = new User(usuario);
    usuarioSave.save(callback);
};

module.exports = {
    buscarPorId,
    salvarUsuario,
};