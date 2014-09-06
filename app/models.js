var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var findOrCreate = require('mongoose-findorcreate');

var UserSchema = new Schema({
    id: Number,
    token: String,
    tokenSecret: String,
    profile_image_url: String,
    screen_name: String,
    name: String
});

var TweetSchema = new Schema({
    queue: String,
    text: String
});

var QueueSchema = new Schema({
    name: String,
    hashtags: {
        content: String,
        length: Number
    },
    interval: String,
    dayOfWeek: Number,
    hourOfDay: Number,
    minuteOfHour: Number,
    secondOfMinute: Number
});

UserSchema.plugin(findOrCreate);
TweetSchema.plugin(findOrCreate)
QueueSchema.plugin(findOrCreate)

models = {
    user: mongoose.model('User', UserSchema),
    tweet: mongoose.model('Tweet', TweetSchema),
    queue: mongoose.model('Queue', QueueSchema)
};

module.exports = models;