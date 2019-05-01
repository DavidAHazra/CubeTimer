// Module Imports
const express = require('express');
const path = require('path');
const ensure_login = require('connect-ensure-login');
const file_system = require('fs');
const buffer_replace = require('buffer-replace');
const fetch = require('node-fetch');
const users = require(path.join(__dirname, '../auth_config/users.js'));

const router = express.Router();

// Middleware
function authorise_user(req, res, next) {
    const logged_in_username = req.user.username;
    const url = req.originalUrl;

    if (url.includes(logged_in_username)) {
        return next();

    } else {
        res.redirect('/login');
    }
}

// Thirdparty API (VisualCube)
router.post('/cube_image', (req, res) => {
    const scramble = req.body.scramble;
    if (!scramble) { res.status(400).end(); return; }

    const get_url = 'http://cube.crider.co.uk/visualcube.php?fmt=png&sch=wrgyob&bg=t&size=200&alg=' + scramble;

    fetch(get_url, {
        method: 'GET'
    
    }).then(response => {
        return response.arrayBuffer();

    }).then(image_data => {
        // Base64 encode the image data, then send it
        res.status(200).end(Buffer.from(image_data).toString('base64'));

    }).catch(reason => {
        // This should never be reached (API handles invalid requests)
        // Cannot be tested

        console.log('/cube_image GET failed: ', reason);
        res.status(500).end();
    });
});

// Routes
router.get('/home', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '../static/home/partial_home.html'));
});

router.get('/home/:username', ensure_login.ensureLoggedIn(), authorise_user, (req, res) => {
    file_system.readFile(path.join(__dirname, '../static/home/full_home.html'), (err, data) => {
        if (err || !data) {
            // Cannot be tested
            console.log('An error occured reading full_home.html:', err);
            res.status(302).redirect('/login');
        }

        const file_data = buffer_replace(data, 'USERNAME', req.params.username);
        res.status(200).end(file_data);
    });
});

router.post('/new_time_entry/:username', ensure_login.ensureLoggedIn(), authorise_user, async (req, res) => {
    let user_data = await users.get_users();
    
    if (user_data) {
        for (let id_index = 0; id_index < user_data.length; ++id_index) {
            const user = user_data[id_index];

            if (user.username === req.params.username) {
                const current_date = new Date();
                user_data[id_index].solves.push({
                    date: current_date.toDateString(),
                    solve_time: req.body.solve_time,
                    scramble: req.body.scramble
                });
            }
        }

        users.write_user_data(JSON.stringify(user_data));
    }

    res.status(204).end();
});

router.get('/user_solves/:username', ensure_login.ensureLoggedIn(), authorise_user, (req, res) => {
    users.find_by_username(req.params.username, (err, user) => {
        if (err || !user) {
            console.log('Error in user_solves GET:', err);
            return;
        }

        const user_solves = JSON.stringify(user.solves);
        res.status(200).end(user_solves);
    });
});

router.delete('/delete_data/:username', ensure_login.ensureLoggedIn(), authorise_user, async (req, res) => {
    let user_data = await users.get_users();

    if (user_data) {
        for (let id_index = 0; id_index < user_data.length; ++id_index) {
            const user = user_data[id_index];

            if (user.username === req.params.username) {
                user_data[id_index].solves = [];
            }
        }
        
        users.write_user_data(JSON.stringify(user_data));
    }

    res.status(204).end();
});

router.delete('/delete_entry/:username/:index', ensure_login.ensureLoggedIn(), authorise_user, async (req, res) => {
    let user_data = await users.get_users();

    if (user_data) {
        for (let id_index = 0; id_index < user_data.length; ++id_index) {
            const user = user_data[id_index];

            if (user.username === req.params.username) {
                user_data[id_index].solves.splice(req.params.index, 1);
            }
        }
        
        users.write_user_data(JSON.stringify(user_data));
    }

    res.status(204).end();
});

router.get('/solve_details/:username/:index', ensure_login.ensureLoggedIn(), authorise_user, async (req, res) => {
    file_system.readFile(path.join(__dirname, '../static/solve_details/solve_details.html'), (err, data) => {
        if (err || !data) { 
            console.log('An error occured reading solve_details.html:', err);
            res.status(302).redirect('/login');
        }

        let file_data = buffer_replace(data, 'USERNAME', req.params.username);
        file_data = buffer_replace(file_data, '{INDEX}', req.params.index);
        res.status(200).end(file_data);
    });
});

router.get('/profile/:username', ensure_login.ensureLoggedIn(), authorise_user, async (req, res) => {
    file_system.readFile(path.join(__dirname, '../static/profile/profile.html'), (err, data) => {
        if (err || !data) { 
            console.log('An error occured reading solve_details.html:', err);
            res.status(302).redirect('/login');
        }

        const file_data = buffer_replace(data, 'USERNAME', req.params.username);
        res.status(200).end(file_data);
    });
});

module.exports = router;