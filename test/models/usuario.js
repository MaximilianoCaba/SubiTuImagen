const role = require('../../modules/models/enum/roles');
const mongoose = require('mongoose');


var user_schema = mongoose.Schema({
    _id: {type: Number},
    username: {type: String, unique: true},
    password: {type: String},
    email: {type: String, unique: true},
    avatar: {type: String},
    userdate: {type: String},
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    role: {type: String, enum: role, require: true},
    alerts: {type: Number},
    facebook: {
        id: String,
        token: String,
    },
    google: {
        id: String,
        token: String,
    },
});


const Usuario = module.exports = mongoose.model('Usuario', user_schema);
module.exports.Usuario = Usuario;