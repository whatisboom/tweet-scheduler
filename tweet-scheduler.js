var express = require('express');
var app = express();
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;

var config = require('./config');

passport.serializeUser(function(user, done) {
    done(null, user);
    // findOrCreate based on id
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new TwitterStrategy(
    config.twitterApi,
    function(token, tokenSecret, profile, done) {
        //wrap this in findOrCreate based on profile id
        return done(null, profile);
    }
));

//app.get('/auth/twitter', )

app.get('*', function(req, res) {
    res.sendFile(process.cwd() + '/app.html');
});

app.listen(8080);