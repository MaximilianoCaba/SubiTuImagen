var Suspension = require('../models/suspension')

module.exports = {

    invited: (req, res, next) => {
        if (req.user == undefined) {
            req.flash('error_msg', "Por favor inicie session")
            res.redirect("/users/login");
        } else {
            next()
        }
    },

    unauthorized: (req, res, next) => {
        if (req.user.id != req.params.id) {
            req.flash('error_msg', "Usted no tiene acceso a esta peticion")
            res.redirect("/app");
        } else {
            next()
        }
    },

    userwithoutpw: (req, res, next) => {
        if (req.user != undefined) {
            req.flash('error_msg', "Por favor cambie su contraseña desde su perfil")
            res.redirect("/user.hanldebars/perfil");
        } else {
            next()
        }
    },

    administrator: (req, res, next) => {
        if (req.user.role != "admin_role") {
            res.render("err/403", {err: "Usted no tiene autorizacion para realizar esta peticion"})
        } else {
            next()
        }

    },

    adminOrModerator: (req, res, next) => {
        if (req.user.role != "admin_role") {
            if (req.user.role != "moderator_role") {
                res.render("err/403", {err: "Usted no tiene autorizacion para realizar esta peticion"})
            } else {
                next()
            }

        } else {
            next()
        }
    },

    suspension: (req, res, next) =>{


        Suspension.find({user: req.user.id}, (err, susp)=>{

            if(susp.length == 0){
                next()
            }else{

                res.render("err/403", {err: "Usted no tiene autorizacion para realizar esta peticion", susp: susp})

            }

        })



    }

}