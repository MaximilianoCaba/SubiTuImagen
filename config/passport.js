var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../modules/models/user');
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var auth = require('./auth');

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function (email, password, done) {
        User.getUserByEmail(email, function (err, user) {
            if (err) throw err;
            if (!user) {
                return done(null, false);
            }

            User.comparePassword(password, user.password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        });
    }));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.getUserById(id, function (err, user) {
        done(err, user);
    });
});

// FACEBOOK STRATEGY

passport.use(new FacebookStrategy({
    clientID: auth.facebookAuth.clientID,
    clientSecret: auth.facebookAuth.clientSecret,
    callbackURL: auth.facebookAuth.callbackURL,
    profileFields: ['name', 'email', 'link', 'locale', 'timezone', 'photos'],
    passReqToCallback: true,
}, function (req, accessToken, refreshToken, profile, done) {
    var username = profile.name.givenName + profile.name.middleName + profile.name.familyName;

    if(!req.user){

        User.findOne({'facebook.id': profile.id}, function (err, user) {
            console.log(user);
            console.log("asfafafs")
            console.log(profile.id)
            if (err) throw err;

            if (!user) {

                User.findOne({email: profile._json.email}, (err, user2) => {
                    if (err) throw err;

                    if (!user2) {

                        User.findOne({username: username}, (err, user3) => {
                            if (err) throw err;

                            if (!user3) {

                                var user = new User();
                                user.facebook.id = profile.id;
                                user.facebook.token = accessToken;
                                user.email = profile._json.email;
                                user.username = username;
                                user.avatar = "avatar.jpg";
                                user.role = "user_role";
                                user.alerts = 0;
                                user.google.id ="null";

                                user.save(function (err) {
                                    if (err) throw err;

                                    done(null, user);
                                });

                            } else {

                                var user = new User();
                                user.facebook.id = profile.id;
                                user.facebook.token = accessToken;
                                user.email = profile._json.email;
                                user.username = username + Math.round(Math.random() * 10) + 1;
                                user.avatar = "avatar.jpg";
                                user.role = "user_role";
                                user.alerts = 0;
                                user.google.id ="null";


                                user.save(function (err) {
                                    if (err) throw err;

                                    done(null, user);
                                });

                            }

                        })

                    } else {
                        req.flash('error_msg', "El email registrado en FB esta en nuestra DB, por favor vincule su cuenta FB desde su perfil");
                        done(err);
                    }

                })
            } else {
                if (user.facebook.id == profile.id) {
                    done(null, user);
                }

            }

        })
    }else{

        User.findOne({'facebook.id': profile.id},(err, user) => {

            if(user){

                req.flash('error_msg', "La cuenta de FB que desea vincular ya esta registrada en nuestra DB")
                done(err)

            }else{

                User.findOne({email: profile._json.email}, (err, user2) => {
                    if (err) throw err;

                    if (!user2) {

                        User.findById(req.user._id,(err, usuario)=>{

                            usuario.facebook.id = profile.id;
                            usuario.facebook.token = accessToken;
                            usuario.email = profile._json.email;

                            usuario.save((err)=>{
                                if(err){done(err)}

                                done(null, usuario)
                            })

                        })

                    } else {


                        if(req.user.id == user2.id){

                            User.findById(req.user._id,(err, usuario)=>{

                                usuario.facebook.id = profile.id;
                                usuario.facebook.token = accessToken;

                                usuario.save((err)=>{
                                    if(err){done(err)}

                                    req.flash('success_msg', "Cuenta asociada");

                                    done(null, usuario)
                                })

                            })
                        }else{
                            req.flash('error_msg', "Usted tiene dos cuentas, por favor elimine una de sus dos cuentas ");
                            done(err);
                        }

                    }

                })

            }

        })

    }

}));


// GOOGLE STRATEGY


passport.use(new GoogleStrategy({
    clientID: auth.googleAuth.clientID,
    clientSecret: auth.googleAuth.clientSecret,
    callbackURL: auth.googleAuth.callbackURL,
    profileFields: ['name', 'email', 'link', 'locale', 'timezone', 'photos'],
    passReqToCallback: true,
}, function (req, accessToken, refreshToken, profile, done) {
    var username = profile.name.givenName + " " + profile.name.familyName;
console.log(profile)
    if(!req.user){

        User.findOne({'google.id': profile.id}, function (err, user) {
            if (err) throw err;

            if (!user) {

                User.findOne({email: profile.emails[0].value}, (err, user2) => {
                    if (err) throw err;

                    if (!user2) {

                        User.findOne({username: username}, (err, user3) => {
                            if (err) throw err;

                            if (!user3) {

                                var user = new User();
                                user.google.id = profile.id;
                                user.google.token = accessToken;
                                user.email = profile.emails[0].value
                                user.username = username;
                                user.avatar = "avatar.jpg";
                                user.role = "user_role";
                                user.alerts = 0;
                                user.facebook.id ="null";


                                user.save(function (err) {
                                    if (err) throw err;

                                    done(null, user);
                                });

                            } else {

                                var user = new User();
                                user.google.id = profile.id;
                                user.google.token = accessToken;
                                user.email = profile.emails[0].value;
                                user.username = username + Math.round(Math.random() * 10) + 1;
                                user.avatar = "avatar.jpg";
                                user.role = "user_role";
                                user.alerts = 0;
                                user.facebook.id ="null";


                                user.save(function (err) {
                                    if (err) throw err;

                                    done(null, user);
                                });

                            }

                        })

                    } else {
                        req.flash('error_msg', "El email registrado en FB esta en nuestra DB, por favor vincule su cuenta FB desde su perfil");
                        done(err);
                    }

                })
            } else {
                if (user.google.id == profile.id) {
                    done(null, user);
                }

            }

        })
    }else{

        User.findOne({'google.id': profile.id},(err, user) => {

            if(user){

                req.flash('error_msg', "La cuenta de Google que desea vincular ya esta registrada en nuestra DB")
                done(err)

            }else{

                User.findOne({email: profile.emails[0].value}, (err, user2) => {
                    if (err) throw err;

                    if (!user2) {

                        User.findById(req.user._id,(err, usuario)=>{

                            usuario.google.id = profile.id;
                            usuario.google.token = accessToken;
                            usuario.email = profile.emails[0].value;

                            usuario.save((err)=>{
                                if(err){done(err)}

                                done(null, usuario)
                            })

                        })

                    } else {


                        if(req.user.id == user2.id){

                            User.findById(req.user._id,(err, usuario)=>{

                                usuario.google.id = profile.id;
                                usuario.google.token = accessToken;

                                usuario.save((err)=>{
                                    if(err){done(err)}

                                    req.flash('success_msg', "Cuenta asociada");

                                    done(null, usuario)
                                })

                            })
                        }else{
                            req.flash('error_msg', "Usted tiene dos cuentas, por favor elimine una de sus dos cuentas ");
                            done(err);
                        }

                    }

                })

            }

        })

    }

}));