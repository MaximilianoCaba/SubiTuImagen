const usuarioRepository = require('../../repository/user')
const likeRepository = require('../../repository/like')
const comentarioRepository = require('../../repository/coment')
const alertaRepository = require('../../repository/alert')





module.exports = {

    verPerfilPersonal: (usuarioId, done) =>{
        alertaRepository.buscarPorUsuario(usuarioId, (err, alerta)=>{
            if(err){done(err)}
            usuarioRepository.buscarPorId(usuarioId, (err, usuario)=>{
                if(err){done(err)}
                done(err, alerta, usuario)
            })
        })

    },

    verPerfilPorId: (usuarioId, done) => {


        usuarioRepository.buscarPorId(usuarioId, (err, usuario) => {
            if (usuario == undefined) {
                const error = "usuario no existe";

                done(error)

            } else {

                likeRepository.buscarPorUsuario(usuarioId, (err, likes) => {
                    if (err) {err}
                    var cantLikes = likes.length


                    comentarioRepository.buscarUltimos5ComentariosPorUsuarioId(usuarioId, (err, coments) => {
                        if (err) {
                            err
                        }

                        var cantComents = coments.length
                        var comentarios = new Array();

                        for (var coment of coments.reverse()) {
                            console.log(comentarios.length)
                            if (comentarios.length <= 4) {

                                comentarios.push(coment)
                            }
                        }

                        const error = "";
                        const array = {
                            cantLikes,
                            usuario,
                            comentarios,
                            cantComents,
                        };

                        done(error, array)

                    })
                })
            }
        })


    },
    desvincularFacebook: (usuarioId, done) =>{

        usuarioRepository.buscarPorId(usuarioId, (err, useer) => {

            useer.facebook.id = "null";
            useer.facebook.token = " ";

            usuarioRepository.salvarUsuario(useer, (err)=>{
                if(err){done(err)}
                done(err)
            })

        })

    },

    desvincularGoogle: (usuarioId, done) =>{

        usuarioRepository.buscarPorId(usuarioId, (err, useer) => {

            useer.google.id = "null";
            useer.google.token = " ";

            usuarioRepository.salvarUsuario(useer, (err)=>{
                if(err){done(err)}
                done(err)
            })

        })

    },

};



