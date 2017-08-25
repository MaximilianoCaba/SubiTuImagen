var mongoose = require("mongoose");


var alert_schema = new mongoose.Schema({
    _id: {type: Number},
    message: {type: String, required:true},
    user: {type: String, required:true},
    image: {type: String},
    date: {type: String, required:true},
    hour: {type: String, required:true},
});


var Alerta = module.exports = mongoose.model("Alerta", alert_schema);
module.exports.Alerta = Alerta;