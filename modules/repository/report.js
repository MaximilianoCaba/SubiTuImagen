var Report = require('../models/report');

crearReporte = (nuevoReporte, callback)=>{
    var reporteAguardar = new Report(nuevoReporte);
    reporteAguardar.save(callback);
};

eliminarReporte = (idReporte, callback) =>{
    Report.remove({_id: idReporte}, callback);
};

module.exports ={

    crearReporte: crearReporte,
    eliminarReporte: eliminarReporte,
};