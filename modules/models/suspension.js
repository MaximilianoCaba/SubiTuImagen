var mongoose = require("mongoose");

var suspension_schema = new mongoose.Schema({
    coment: {type: String, required:true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required:true},
    date: {type: String, required:true},
    dateSuspension: {type: String, required:true},
});

var Suspension = module.exports = mongoose.model("Suspension", suspension_schema);