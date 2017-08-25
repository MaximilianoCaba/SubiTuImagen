const Coment = require('../models/coment');

eliminarComentarioPorId = (comentarioId, callback)=>{
  Coment.remove({_id: comentarioId}, callback);
};

salvarComentario = (nuevoComentario, callback)=> {
    const comentario = new Coment(nuevoComentario);
    comentario.save(comentario, callback);
};

buscarPorImagenId = (imagenId, callback)=>{
    Coment.find({image: imagenId}, callback);
};

eliminarPorImagen = (imagenId, callback)=>{
    Coment.remove({image: imagenId}, callback);
};

buscarUltimos5ComentariosPorUsuarioId = (usuarioId, callback)=>{
    Coment.find({creator: usuarioId}).sort({date: -1}).populate('image').exec(callback);
};

module.exports ={
    eliminarComentarioPorId,
    salvarComentario,
    buscarPorImagenId,
    eliminarPorImagen,
    buscarUltimos5ComentariosPorUsuarioId
};