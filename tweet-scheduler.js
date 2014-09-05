var express = require('express');
var app = express();
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var session = require('express-session');
var bodyParser = require('body-parser');
var router = express.Router();
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn

var config = require('./config');

passport.serializeUser(function(user, done) {
    console.log('Serialize User', user._json);
    done(null, user._json);
    // findOrCreate based on id
});

passport.deserializeUser(function(obj, done) {
    console.log('Deserialize User', obj);
    done(null, obj);
});

passport.use(new TwitterStrategy(
    config.twitterApi,
    function(token, tokenSecret, profile, done) {
        //wrap this in findOrCreate based on profile id, return result object
        return done(null, profile);
    }
));

app.use(bodyParser.json());
app.use(session({
    secret: config.secret,
    resave: true,
    saveUninitialized: true
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

app.get('*',ensureLoggedIn('/auth/twitter') , function(req, res) {
    res.sendFile(process.cwd() + '/app.html');
});

app.listen(8080);