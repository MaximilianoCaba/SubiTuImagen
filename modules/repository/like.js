const Like = require('../models/like');

buscarPorImagenUsuario = (imagenId, usuarioId, callback) => {
    Like.find({image: imagenId, userLike: usuarioId}, callback);
};

salvarLike = (nuevoLike, callback) => {
    const like = new Like(nuevoLike);
    like.save(callback);
};

eliminarLike = (like, callback) => {
    Like.remove(like, callback);
};

buscarPorUsuario = (usuarioId, callback)=>{
    Like.find({userLike: usuarioId}, callback);
};


module.exports = {

    buscarPorImagenUsuario,
    salvarLike,
    eliminarLike,
    buscarPorUsuario

};
