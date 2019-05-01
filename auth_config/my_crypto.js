const crypto = require('crypto');

function generate_random_string(length) {
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);

}

function sha512(password, salt) {
    const hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    return hash.digest('hex');
}



exports.sha512 = sha512;
exports.process_password = (password) => {
    const SALT_LENGTH = 32;
    const salt = generate_random_string(SALT_LENGTH);
    const password_data = sha512(password, salt);

    return {
        hashed_password: password_data,
        salt: salt
    };
};

