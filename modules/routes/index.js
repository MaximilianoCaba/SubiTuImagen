const express = require('express');
const router = express.Router();
const date =require('../middleware/date');
const passport = require('passport')


// servicios
const imagenService =require('../services/imagen');
const suspensionService = require('../services/suspension');

// requerimiento de las rutas de toda la app
const forgot = require('./user_routes/forgot');
const users = require('./user_routes/login');
const app_routes = require('./app_routes');
const user =require('./user_routes');
const administrator = require('./admin_routes');

// ligamiento de las rutas con la url principal
router.use(forgot);
router.use('/users', users);
router.use('/app', app_routes);
router.use('/user', user);
router.use('/admin/module', administrator);


// autenticacion con facebook
router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_location'] }));
router.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
    res.redirect(req.session.returnTo || '/');
});

// autenticacion con google

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login',
}));



// pagina de inicio
router.get('/', date.dateNow, function(req, res){
	imagenService.buscarTodasImagenesConUsuario((err, imagenes)=>{
		if (err){err}
		// se elimina todas las suspensiones cuando coinciden las fechas
		suspensionService.eliminarSuspensionPorfecha(req.date, (err)=>{
            if (err){err}
            res.render("index", {imagenes: imagenes.reverse()});
        })
    });
});

//elimine de este sector a ensureAuthenticated que no se utilizaba

module.exports = router;