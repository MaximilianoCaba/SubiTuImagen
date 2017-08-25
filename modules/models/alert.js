var mongoose = require("mongoose");


var alert_schema = new mongoose.Schema({
    message: {type: String, required:true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required:true},
    image: {type: mongoose.Schema.Types.ObjectId, ref: "Imagen"},
    date: {type: String, required:true},
    hour: {type: String, required:true},
});


var Alert = module.exports = mongoose.model("Alert", alert_schema);
