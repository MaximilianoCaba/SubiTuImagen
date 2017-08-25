const usuarioRepository = require('../../../repository/user');



module.exports = {

    verAvatarPorId: (usuarioId, done) => {
        usuarioRepository.buscarPorId(usuarioId, (err, usuario) => {
            if (err) {done(err)}
            done(err, usuario)
        })
    }

};