const express = require('express');
const path = require('path');

const router = express.Router();

router.get('/', (req, res) => {
    res.status(302).redirect('/home');
});

// Serving all static files that aren't specified
router.get('/static/*', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '..' + req.originalUrl));
});

// Serving the about page, which doesn't need auth
router.get('/about', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '../static/about/about.html'));
});

module.exports = router;
