var reportRepository = require('../repository/report');

 crearReporte =  (nuevoReporte, callback) =>{
    reportRepository.crearReporte(nuevoReporte, callback);
 };

eliminarReporte = (idReporte, callback) =>{
    reportRepository.eliminarReporte(idReporte, callback);
};

 module.exports = {

     crearReporte,
     eliminarReporte

 };