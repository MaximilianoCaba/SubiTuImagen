var mongoose = require("mongoose");
var categorias = require('./enum/categorias')

var img_schema = new mongoose.Schema({
    title: {type: String, required:true},
    creator: {type: mongoose.Schema.Types.ObjectId, ref: "User", required:true},
    name: {type: String, require:true},
    extension: {type: String, require:true},
    coment: String,
    dateupload: {type: String, require:true},
    hourupload: {type: String, require:true},
    cantComents: {type: Number, require:true},
    likes: {type: Number, require:true},
    category: {type: String, enum: categorias, require:true},
    tags: {type:[], require:true}
});


var Imagen = module.exports= mongoose.model("Imagen",img_schema);

module.exports.saveImagen = function(imagen, callback) {
    Imagen.save(imagen, callback);
};

module.exports.findByNameFile = function(name, callback){
    Imagen.find({name: name}, callback);
};

module.exports.getImagenbyName = function(name, callback){
    var query = {name: name};
    User.findOne(query, callback);
}

module.exports.Imagen = Imagen;
