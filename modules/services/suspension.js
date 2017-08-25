const suspensionRepository =require('../repository/suspension');

eliminarSuspensionPorfecha = (fechaActual, callback)=> {
    suspensionRepository.eliminarSuspensionPorfecha(fechaActual, callback);
};

module.exports = {
    eliminarSuspensionPorfecha,
}