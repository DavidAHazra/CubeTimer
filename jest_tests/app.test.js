const request = require('supertest');
const path = require('path');

const app = require(path.join(__dirname, '../routes/app.js'));

/*

All routes tested, names below:
    home.js    
        - POST /cube_image
        - [AUTH] GET /home
        - [AUTH] GET /home/:username
        - [AUTH] POST /new_time_entry/:username
        - [AUTH] GET /user_solves/:username
        - [AUTH] GET /solve_details/:username/:index
        - [AUTH] GET /profile/:username

    login.js
        - GET /login
        - GET /logout
        - [AUTH] POST /login

    register.js
        - GET /register

    static_serve.js
        - GET /static/*
        - GET /about
*/

// home.js
describe('Testing home.js routes', () => {
    // - POST /cube_image
    describe('Testing POST /cube_image with correct data', () => {
        test('Should respond with status code 200', async () => {
            const response = await request(app).post('/cube_image').send({
                scramble: 'U\' R2 B2 D L2 R2 D\' U2 L2 U F2 R\' B2 F\' D2 U\' L\' B U\' B\' U\''
            });

            expect(response.statusCode).toBe(200);
        });
    });

    describe('Testing POST /cube_image with no data', () => {
        test('Should respond with status code 400', async () => {
            const response = await request(app).post('/cube_image');
            expect(response.statusCode).toBe(400);
        });
    });    

    // - GET /home
    describe('Testing GET /home', () => {
        test('Should respond with status code 200', async () => {
            const response = await request(app).get('/home');
            expect(response.statusCode).toBe(200);
        });

        test('Should respond with Content-Type: text/html', async () => {
            const response = await request(app).get('/home');
            expect(response.type).toBe('text/html');
        });
    });

    // - [AUTH] GET /home/:username
    describe('Testing AUTH GET /home/:username', () => {
        test('Should respond with status code 302', async () => {
            const response = await request(app).get('/home/admin');
            expect(response.statusCode).toBe(302);
        });
    });

    // - [AUTH] POST /new_time_entry/:username
    describe('Testing AUTH POST /new_time_entry/:username', () => {
        test('Should respond with status code 302', async () => {
            const response = await request(app).post('/new_time_entry/admin');
            expect(response.statusCode).toBe(302);
        });
    });

    // - [AUTH] GET /user_solves/:username
    describe('Testing AUTH GET /user_solves/:username', () => {
        test('Should respond with status code 302', async () => {
            const response = await request(app).get('/user_solves/admin');
            expect(response.statusCode).toBe(302);
        });
    });

    // - [AUTH] GET /solve_details/:username/:index
    describe('Testing AUTH GET /solve_details/:username/:index', () => {
        test('Should respond with status code 302', async () => {
            const response = await request(app).get('/solve_details/admin/0');
            expect(response.statusCode).toBe(302);
        });
    });

    // - [AUTH] GET /profile/:username
    describe('Testing AUTH GET /solve_details/:username/:index', () => {
        test('Should respond with status code 302', async () => {
            const response = await request(app).get('/solve_details/admin/0');
            expect(response.statusCode).toBe(302);
        });
    });
});

// login.js
describe('Testing login.js routes', () => {
    // - GET /login
    describe('Testing GET /login', () => {
        test('Should respond with status code 200', async () => {
            const response = await request(app).get('/login');
            expect(response.statusCode).toBe(200);
        });

        test('Should respond with Content-Type: text/html', async () => {
            const response = await request(app).get('/login');
            expect(response.type).toBe('text/html');
        });
    });

    // - GET /logout
    describe('Testing GET /logout', () => {
        test('Should respond with status code 302', async () => {
            const response = await request(app).get('/logout');
            expect(response.statusCode).toBe(302);
        });
    });

    // - POST /login
    describe('Testing AUTH POST /login', () => {
        test('Should respond with status code 302', async () => {
            const response = await request(app).post('/login').send({
                username: 'admin'
            });

            expect(response.statusCode).toBe(302);
        });
    });
});

// register.js
describe('Testing register.js routes', () => {
    // - GET /register
    describe('Testing GET /register', () => {
        test('Should respond with status code 200', async () => {
            const response = await request(app).get('/register');
            expect(response.statusCode).toBe(200);
        });

        test('Should respond with Content-Type: text/html', async () => {
            const response = await request(app).get('/register');
            expect(response.type).toBe('text/html');
        });
    });
});

// static_serve.js
describe('Testing static_serve.js routes', () => {
    // - GET /static/*
    describe('Testing GET /static/*', () => {
        // This is a catch-all request, so I'm only going to manually test 3 cases

        describe('Testing GET /static/home/home.css', () => {
            test('Should respond with status code 200', async () => {
                const response = await request(app).get('/static/home/home.css');
                expect(response.statusCode).toBe(200);
            });    
        });

        describe('Testing GET /static/about/about.css', () => {
            test('Should respond with status code 200', async () => {
                const response = await request(app).get('/static/about/about.css');
                expect(response.statusCode).toBe(200);
            });    
        });

        describe('Testing GET /static/login/login.css', () => {
            test('Should respond with status code 200', async () => {
                const response = await request(app).get('/static/login/login.css');
                expect(response.statusCode).toBe(200);
            });    
        });
    });

    // - GET /about
    describe('Testing GET /about', () => {
        test('Should respond with status code 200', async () => {
            const response = await request(app).get('/about');
            expect(response.statusCode).toBe(200);
        });

        test('Should respond with Content-Type: text/html', async () => {
            const response = await request(app).get('/about');
            expect(response.type).toBe('text/html');
        });
    });
});
