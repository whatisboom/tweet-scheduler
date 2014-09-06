var express = require('express');
var app = express();
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var session = require('express-session');
var bodyParser = require('body-parser');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn
var mongoose = require('mongoose');
var connect = require('connect');
var SessionStore = require('session-mongoose')(connect);
var cookieParser = require('cookie-parser');
var extend = require('extend');

var models = require('./app/models');
var contextBase = require('./app/context-base');
var config = require('./config');
var router = express.Router();

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
        console.log(token, tokenSecret);
        models.user.findOrCreate({id: profile.id}, function(err, user, created) {
            if (err) { return done(err); }

            user.token = token;
            user.tokenSecret = tokenSecret;
            user.profile_image_url = profile._json.profile_image_url;
            user.screen_name = profile._json.screen_name;
            user.name = profile._json.name;

            user.save();

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

router.use(function(req, res, next) {
    console.log('API: %s %s %s', req.method,  req.user.screen_name, req.url);
    next();
});

router.route('/me')
    .get(function(req, res) {
        var context = contextBase;
        context.meta.user = req.user;
        res.json(context);
    });

router.route('/tweets')
    .get(function(req, res) {
        var context = contextBase;
        models.tweet.find(function(error, tweets) {
            if (error) {
                context.meta.errors.push(error);
            }
            else {
                context.data.tweets = tweets
            }
        });
        res.json(context);
    })
    .post(function(req, res) {
        var context = contextBase;
        var tweet = extend(models.tweet(), req.body.tweet);
        tweet.save(function(error) {
            if (error) {
                console.log(error);
            }
            context.data.tweet = tweet;
            res.json(context);
        });
    });

app.use('/api', router);
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res) {
    res.sendFile(process.cwd() + '/index.html');
});

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

app.get('*', ensureLoggedIn('/auth/twitter'), function(req, res) {
    res.sendFile(process.cwd() + '/app.html');
});

app.listen(config.port);