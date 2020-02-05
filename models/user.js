var mongoose = require( "mongoose" );
var passportLocalMongoose = require( "passport-local-mongoose" );
var userSchema = new mongoose.Schema( {
    type: String,
    username: String,
    cid: String,
    gender: String,
    admin: {
        type: Boolean,
        default: false
    },
    contact: Number,
    email: String,
    password: String
} );
userSchema.plugin( passportLocalMongoose );
module.exports = mongoose.model( "User", userSchema );
