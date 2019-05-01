const express = require('express');
const path = require('path');

// Routers
const router = express.Router();
const static_serve = require(path.join(__dirname, '/static_serve.js'));
const home_route = require(path.join(__dirname, '/home.js'));
const register_route = require(path.join(__dirname, '/register.js'));
const login_route = require(path.join(__dirname, '/login.js'));

// Using the routers
router.use(static_serve);
router.use(home_route);
router.use(register_route);
router.use(login_route);

// End -> Export routers to app
module.exports = router;