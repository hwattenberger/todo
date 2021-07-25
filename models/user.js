const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');


const TopicSchema = new Schema({
    name: String
})

const UserSchema = new Schema({
    email: String,
    topics: [TopicSchema],
    defaultView: String
})
UserSchema.plugin(passportLocalMongoose); //Adds a field for password, username, and gives you some methods


module.exports = mongoose.model('User', UserSchema);