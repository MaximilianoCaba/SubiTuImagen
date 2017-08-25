var mongoose = require("mongoose");

var like_schema = new mongoose.Schema({
    userLike: {type: mongoose.Schema.Types.ObjectId, ref: "User", required:true},
    image: {type: mongoose.Schema.Types.ObjectId, ref: "Imagen", required:true}
});

var Like = module.exports = mongoose.model("Like",like_schema);