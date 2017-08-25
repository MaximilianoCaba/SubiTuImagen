var mongoose = require("mongoose");
var motive =require('./enum/motivo')

var report_schema = new mongoose.Schema({
    coment: {type: String, required:true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required:true},
    image: {type: mongoose.Schema.Types.ObjectId, ref: "Imagen"},
    comentario: {type: mongoose.Schema.Types.ObjectId, ref: "Mensaje"},
    date: {type: String, required:true},
    hour: {type: String, required:true},
    motive: {type: String, enum: motive, require:true}
});

var Report = module.exports = mongoose.model("Report", report_schema);