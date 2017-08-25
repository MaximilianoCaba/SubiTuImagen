var mongoose = require("mongoose");

var mensaje_schema = new mongoose.Schema({
    comentario: {type: String, required:true},
    creator: {type: mongoose.Schema.Types.ObjectId, ref: "User", required:true},
    image: {type: mongoose.Schema.Types.ObjectId, ref: "Imagen", required:true},
    usernameCreator: {type: String, required:true},
    datePost: {type: String, required:true}
});

var Mensaje = module.exports = mongoose.model("Mensaje",mensaje_schema);
