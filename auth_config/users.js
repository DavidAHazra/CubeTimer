// Module Imports
const path = require('path');
const file_system = require('fs');

const USER_DATA_PATH = path.join(__dirname, '/user_data.json');


/*

User information storage outline
Per user:

    id                  Unique identifier
    username            Username
    password            Password stored as a salted SHA-512 hash
    salt                The salt used to hash the password
    solves [            
        {
            date        The current date as a timestamp (ms since Jan 1, 1970)
            solve_time  Time to complete solve in ms
            scramble    Algorithm used to scramble the cube
        }
    ]

*/

function get_users() {
    if (!file_system.existsSync(USER_DATA_PATH)) {
        console.log('User data does not exist, creating user data file');

        // Function here is synchronous because we don't want the
        // rest of the function to execute when the file does not exist
        file_system.writeFileSync(USER_DATA_PATH, '[]');
    }

    return new Promise((resolve, reject) => {
        file_system.readFile(USER_DATA_PATH, (err, data) => {
            if (err) {
                console.log('Error reading user data file:', err);
                reject(err);
            }
    
            const all_users = JSON.parse(data);
            if (!all_users) {
                console.log('Error parsing user data file');
            }
    
            resolve(all_users);
        });    
    });
}

function write_user_data(overwrite_data) {
    file_system.writeFile(USER_DATA_PATH, overwrite_data, (err) => {
        if (err) {
            console.log('Error writing user data file:', err);
        }
    });
}

async function find_by_id(id, callback) {
    const user_data = await get_users();
    const id_index = id - 1;

    if (user_data) {
        if (user_data[id_index]) {
            callback(null, user_data[id_index]);

        } else {
            callback(new Error('User ' + id + ' does not exist'));
        }

    } else {
        callback(new Error('User data parsing occured'));
    }
}

async function find_by_username(username, callback) {
    const user_data = await get_users();

    if (user_data) {
        for (let id_index = 0; id_index < user_data.length; ++id_index) {
            const user = user_data[id_index];

            if (user.username === username) {
                return callback(null, user);
            }
        }    
    }

    return callback(null, null);
}

exports.get_users = get_users;
exports.write_user_data = write_user_data;
exports.find_by_id = find_by_id;
exports.find_by_username = find_by_username;