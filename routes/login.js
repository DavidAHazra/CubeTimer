// Module Imports
const express = require('express');
const path = require('path');
const passport = require('passport');

const router = express.Router();

// Routes (also handle logout routes)
router.get('/login', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '../static/login/login.html'));
});

router.get('/logout', (req, res) => {
    req.logout();
    res.status(302).redirect('/');
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/register' }), (req, res) => {
    if (!req.body.username) { res.status(400).end(); return; }
    res.status(302).redirect('/home/' + req.body.username);
});



module.exports = router;