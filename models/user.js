const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

/* 
just use email in the schema because using the passportLocalMongoose plugin adds 
on to our schema a field for username and password, make sure the username is unique,
give us some additional methods we can use 
*/

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);