const likeRepository = require('../repository/like');

buscarPorImagenUsuario = (imagenId, usuarioId, callback) =>{
    likeRepository.buscarPorImagenUsuario(imagenId, usuarioId, callback);
};

salvarLike = (nuevoLike, callback) =>{
    likeRepository.salvarLike(nuevoLike, callback);
};

eliminarLike = (like, callback) =>{
    likeRepository.eliminarLike(like, callback);
};

module.exports = {

    buscarPorImagenUsuario,
    salvarLike,
    eliminarLike
};