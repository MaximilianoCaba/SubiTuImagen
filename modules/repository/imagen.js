const Imagen = require('../models/imagen');


buscarPorTags = (tagsList, callback) => {
    Imagen.find({tags: {$in: tagsList}}, callback);
};

buscarPorId = (imagenId, callback) => {
    Imagen.findById(imagenId, callback);
};

buscarPorName = (imagenName, callback) => {
    Imagen.find({name: imagenName}, callback);
};

buscarPorCategoria = (categoria, callback)=>{
    Imagen.find({category: categoria}, callback);
};

buscar7diasOrdenadoPorLikes = (categoria, listaDias, callback)=>{
    Imagen.find({dateupload: {$in: listaDias}, category: categoria}).sort({likes: -1}).exec(callback);
};

buscar7diasOrdenadoPorComentarios = (categoria, listaDias, callback)=>{
    Imagen.find({category: categoria, dateupload: {$in: listaDias}}).sort({cantComents: -1}).exec(callback);
};

salvarImagen = (nuevaImagen, callback) => {
    console.log(nuevaImagen);
    var imagen = new Imagen(nuevaImagen);
    imagen.save(imagen, callback);
};

buscarTodasImagenesConUsuario = (callback)=>{
    Imagen.find({}).populate("creator").exec(callback)
    };

eliminarPorId = (imagenId, callback)=>{
    Imagen.findByIdAndRemove(imagenId, callback);
};

buscarPorUsuario = (usuarioId, callback)=>{
  Imagen.find({creator: usuarioId}, callback);
};


module.exports = {

    buscarPorTags,
    buscarPorId,
    buscarPorName,
    salvarImagen,
    buscarPorCategoria,
    buscar7diasOrdenadoPorLikes,
    buscar7diasOrdenadoPorComentarios,
    buscarTodasImagenesConUsuario,
    eliminarPorId,
    buscarPorUsuario

};