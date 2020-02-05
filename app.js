var express = require( "express" ),
    bodyParser = require( "body-parser" ),
    mongoose = require( "mongoose" ),
    passport = require( "passport" ),
    LocalStrategy = require( "passport-local" )

    
var app = express();
var passportLocalMongoose = require( "passport-local-mongoose" );
//APP CONFIG       

mongoose.connect( 'mongodb://localhost/inry_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
} );
// mongoose.connect( process.env.DATABASEURL, { useNewUrlParser: true } );
app.set( "view engine", "ejs" );
app.use( express.static( "public" ) );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: true } ) );
//mongoose model config

var User = require('./models/user');
//Passport config
app.use( require( "express-session" )( {
    secret: "inry",
    resave: false,
    saveUninitialized: false
} ) );
app.use( passport.initialize() );
app.use( passport.session() );
passport.use( new LocalStrategy( User.authenticate() ) );
passport.serializeUser( User.serializeUser() );
passport.deserializeUser( User.deserializeUser() );
app.use( function ( req, res, next ) {
    res.locals.currentUser = req.user;
    next();
} );
app.use( function ( req, res, next ) {
    res.locals.currentUser = req.user;
    // res.locals.error = req.flash( "error" );
    // res.locals.success = req.flash( "success" );
    next();
} );

app.get('/',function(req,res){
    res.render("index.ejs");
});

app.post('/choose',function(req,res){
    console.log(req.user);
    var t1 = req.user.type;
    var stop = req.body.busstop;
    console.log(stop);
    var bill = 0;
    switch(stop){
        case 'sec':  bill =24000;
        break;
        case 'jub': bill= 18000;
        break;
        case 'gach': bill=16800;
        break;
        case'ban': bill=16000;
        break;
    }
if ( t1 == 'Faculty' ) {
    bill = 0.5*bill;
}
res.send({Bill:bill});
})

app.get("/fdreport",function(req,res){
    console.log('financial report send');
    res.redirect("/");
})



















//auth
app.get( "/register", function ( req, res ) {
    res.render( "register" );
} );
// //handle sign up
app.post( "/register",  function ( req, res ) {
    var a = req.body.admin;
    var admin = false;
    if(a == 'secretcode'){
    admin = true;        
    }
    var newUser = new User( {
        username: req.body.name,
        email: req.body.email,
        type: req.body.type,
        contact: req.body.contact,
        cid: req.body.cid,
        gender: req.body.gender,
        admin : admin
    } );
    console.log( newUser );
    User.register( newUser, req.body.password, function ( err, user ) {
        if ( err ) {
            console.log( err );
            res.redirect( "/", {
                msg: err.toString()
            } );
        } else {
            res.redirect( "/login" );
        }
    } );

} );
// //show login
app.get( "/login", function ( req, res ) {

    res.render( "login" );

} );
app.post( "/login", passport.authenticate( "local", {
        successRedirect: "/",
        failureRedirect: "/login"
    } )
);
//logout
app.get( "/logout", function ( req, res ) {
    req.logout();
    res.redirect( "/" );
} );

function isLoggedIn( req, res, next ) {
    if ( req.isAuthenticated() ) {
        return next();
    }
    req.flash( "error", "Please Login!" )
    res.redirect( "/login" );
}
app.listen( 3000, process.env.IP, function () {
    console.log( " app is running" );
} );
