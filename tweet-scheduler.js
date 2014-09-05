var express = require('express');
var app = express();
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var session = require('express-session');
var bodyParser = require('body-parser');
var router = express.Router();
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn
var mongoose = require('mongoose');
var connect = require('connect');
var SessionStore = require('session-mongoose')(connect);
var models = require('./models');
var cookieParser = require('cookie-parser');

var config = require('./config');

var store = new SessionStore({
    url: config.db
});

mongoose.connect(config.db);

passport.serializeUser(function(user, done) {
    done(null, user._json);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new TwitterStrategy(
    config.twitterApi,
    function(token, tokenSecret, profile, done) {
        models.user.findOrCreate({id: profile.id}, function(err, user, created) {
            if (err) { return done(err); }

            return done(null, profile);
        });
    }
));

app.use(bodyParser.json());
app.use(cookieParser(config.secret));
app.use(session({
    secret: config.secret,
    resave: true,
    saveUninitialized: true,
    store: store
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', {successRedirect: '/scheduler', failureRedirect: '/login'}));

router.route('/user')
    .get(function(request, response) {
        var context = {
            meta: {
                user: request.user
            }
        };
        response.json(context);
    });

app.use('/api', router);
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res) {
    res.sendFile(process.cwd() + '/index.html');
});

app.get('*', ensureLoggedIn('/auth/twitter'), function(req, res) {
    res.sendFile(process.cwd() + '/app.html');
});

app.listen(8080);