const imagenRepository = require('../repository/imagen');

buscarPorTags = (tagsList, callback) => {
    imagenRepository.buscarPorTags(tagsList, callback);
};

buscarPorId = (imagenId, callback) => {
    imagenRepository.buscarPorId(imagenId, callback);
};

buscarPorName = (imagenName, callback) => {
    imagenRepository.buscarPorName(imagenName, callback);
};

buscarPorCategoria = (categoria, callback) => {
    imagenRepository.buscarPorCategoria(categoria, callback);
};

buscar7diasOrdenadoPorLikes = (categoria, listaDias, callback) => {
    imagenRepository.buscar7diasOrdenadoPorLikes(categoria, listaDias, callback);
};

buscar7diasOrdenadoPorComentarios = (categoria, listaDias, callback) => {
    imagenRepository.buscar7diasOrdenadoPorComentarios(categoria, listaDias, callback);
};

salvarImagen = (nuevaImagen, callback) => {
    imagenRepository.salvarImagen(nuevaImagen, callback);
};

sumarLike = (imagenName, callback) => {
    imagenRepository.buscarPorName(imagenName, (err, imagen) => {
        const auxiliar = imagen[0].likes + 1;
        imagen[0].likes = auxiliar;
        imagenRepository.salvarImagen(imagen[0], callback);
    });
};

restarLike = (imagenName, callback) => {
    imagenRepository.buscarPorName(imagenName, (err, imagen) => {
        const auxiliar = imagen[0].likes - 1;
        imagen[0].likes = auxiliar;
        imagenRepository.salvarImagen(imagen[0], callback);
    });
};

buscarTodasImagenesConUsuario = (callback)=>{
    imagenRepository.buscarTodasImagenesConUsuario(callback);
};

eliminarPorId = (imagenId, callback) => {
    imagenRepository.eliminarPorId(imagenId, callback);
};

buscarPorUsuario = (usuarioId, callback)=>{
    imagenRepository.buscarPorUsuario(usuarioId, callback);
};
module.exports = {

    buscarPorTags,
    buscarPorId,
    buscarPorName,
    sumarLike,
    restarLike,
    buscarPorCategoria,
    buscar7diasOrdenadoPorLikes,
    buscar7diasOrdenadoPorComentarios,
    salvarImagen,
    buscarTodasImagenesConUsuario,
    eliminarPorId,
    buscarPorUsuario

};