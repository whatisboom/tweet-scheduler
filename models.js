var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var findOrCreate = require('mongoose-findorcreate');

var UserSchema = new Schema({
    id: Number,
    token: String,
    tokenSecret: String
});

UserSchema.plugin(findOrCreate);

models = {
    user: mongoose.model('User', UserSchema)
};

module.exports = models;