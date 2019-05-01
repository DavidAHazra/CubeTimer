// Modules
const express = require('express');
const path = require('path');
const compression = require('compression');
const cookie_parser = require('cookie-parser');
const body_parser = require('body-parser');
const express_session = require('express-session');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const users = require(path.join(__dirname, '../auth_config/users.js'));
const my_crypto = require(path.join(__dirname, '../auth_config/my_crypto.js'));

const routes = require(path.join(__dirname, './routes.js'));

// Passport (User Authorisation) Configuration
passport.use(new LocalStrategy((username, password, callback) => {
    users.find_by_username(username, (err, user) => {
        if (err) { return callback(err); }
        if (!user) { return callback(null, false); }
        if (my_crypto.sha512(password, user.salt) !== user.password) { return callback(null, false); }
        return callback(null, user);
    });
}));

passport.serializeUser((user, callback) => {
    callback(null, user.id);
});

passport.deserializeUser((id, callback) => {
    users.find_by_id(id, (err, user) => {
        if (err) { return callback(err); }
        callback(null, user);
    });
});

// Application Specification
const app = express();
app.set('port', process.env.PORT || 8080);

app.use(compression({ level: 9 }));
app.use(cookie_parser());
app.use(body_parser.urlencoded({ extended: true }));
app.use(body_parser.json());
app.use(express_session({
    secret: 'nSn6PyLX3m7bOu00bGGeI9LMUYJrq3Fb',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(routes);

module.exports = app;