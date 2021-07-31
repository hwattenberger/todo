const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: String,
    defaultView: String,
    todos: [{
        type: Schema.Types.ObjectId,
        ref: 'Todo'
    }],
    public: Boolean
})
UserSchema.plugin(passportLocalMongoose); //Adds a field for password, username, and gives you some methods


module.exports = mongoose.model('User', UserSchema);