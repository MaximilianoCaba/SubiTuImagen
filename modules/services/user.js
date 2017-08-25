const userRepository = require('../repository/user')

buscarPorId = (usuarioId, callback) =>{
    userRepository.buscarPorId(usuarioId, callback);
};

salvarUsuario = (usuario, callback)=>{
    userRepository.salvarUsuario(usuario, callback);
}

module.exports = {
    buscarPorId,
    salvarUsuario,
}