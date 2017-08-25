var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var mongoose = require('mongoose');
var methodOverride = require("method-override");
var cookieSession = require("cookie-session");
var confingPassport = require('./config/passport'); // SE USA!
var helpers = require("./modules/middleware/helpers")

/* exphbs.create({
    helpers: {
        ifEquals: function(a, b, options) {
            if (a === b) {
                return options.fn(this);
            }
            return options.inverse(this);
        },
        foo: function () { return 'BAR!'; }
    }
}); */

// Init App
var app = express();

app.use(methodOverride("_method"));

app.use(cookieSession({
    name: "session",
    keys: ["llave-1","llave-2"]
}));

mongoose.connect('mongodb://localhost/subituimagen');
var db = mongoose.connection;

// View Engine

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
app.engine('handlebars', exphbs({defaultLayout:'layout', helpers: helpers}));




// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));
app.use("/public", express.static("public"));


// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());


// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});








var index = require('./modules/routes/index');
app.use('/', index);
app.get('*', function(req, res){
    res.render("err/404", {err: "La pagina que usted solicito no existe!"})
});



// Set Port
app.set('port', (process.env.PORT || 8500));

app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});