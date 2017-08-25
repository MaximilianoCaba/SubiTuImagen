const Suspension = require('../models/suspension');

eliminarSuspensionPorfecha = (fechaActual, callback)=>{

    Suspension.remove({dateSuspension: fechaActual}, callback);
};

module.exports = {
    eliminarSuspensionPorfecha,
};