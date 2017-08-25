const mongoose = require('mongoose');
const categorias = require('../../modules/models/enum/categorias')

var img_schema = new mongoose.Schema({
    _id: {type: Number},
    title: {type: String, required:true},
    creator: {type: Number, ref: "Usuario", required:true},
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



var Image = module.exports= mongoose.model("Image",img_schema);
module.exports.Image = Image;