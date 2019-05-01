// Module Imports
const express = require('express');
const path = require('path');
const users = require(path.join(__dirname, '../auth_config/users.js'));
const my_crypto = require(path.join(__dirname, '../auth_config/my_crypto.js'));

const router = express.Router();


// Routes
router.get('/register', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '../static/register/register.html'));
});

router.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) { res.status(400).end(); return; }

    users.find_by_username(username, async (err, user) => {
        if (err) { res.status(302).redirect('/register'); }
        if (!user) { 
            // Create user, redirect to login
            let user_data = await users.get_users();
            const processed_password = my_crypto.process_password(password);

            user_data.push({
                id: user_data.length + 1,
                username: username,
                password: processed_password.hashed_password,
                salt: processed_password.salt,
                solves: []
            });

            users.write_user_data(JSON.stringify(user_data));
        }

        // If user already exists, redirect to login page
        res.status(302).redirect('/login');
    });
});


module.exports = router;