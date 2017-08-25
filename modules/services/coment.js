const comentarioRepository = require('../repository/coment');
const imagenService = require('../services/imagen');

eliminaComentarioYrestarComentarioImagen = (comentarioId, imagen, callback) => {
    comentarioRepository.eliminarComentarioPorId(comentarioId, (err) => {
        if (err) {err}
        const auxiliar = imagen.cantComents - 1;
        imagen.cantComents = auxiliar;
        imagenService.salvarImagen(imagen, callback);
    })

};

agregarComentarioYsumarComentarioImagen = (imagenName, comentarioNuevo, callback) => {
    imagenService.buscarPorName(imagenName, (err, imagen) => {
        comentarioNuevo.image = imagen[0].id;
        console.log(comentarioNuevo)
        comentarioRepository.salvarComentario(comentarioNuevo, (err) => {
            if (err) {err}
            var sumaComent = parseInt(imagen[0].cantComents) + 1;
            imagen[0].cantComents = sumaComent;
            imagenService.salvarImagen(imagen[0], callback);
        })
    })
};

buscarPorImagenId = (imagenId, callback)=>{
    comentarioRepository.buscarPorImagenId(imagenId, callback);
};

eliminarPorImagen = (imagenId, callback)=>{
    comentarioRepository.eliminarPorImagen(imagenId, callback);
};

module.exports = {
    eliminaComentarioYrestarComentarioImagen,
    agregarComentarioYsumarComentarioImagen,
    buscarPorImagenId,
    eliminarPorImagen
};