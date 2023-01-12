import request from 'supertest';
import {app} from '../../../app';
import {knexInstance} from "../../../models/connection";
import {setupDb} from "../../../models/setup";


describe('Testing User Creation', () => {
    beforeAll(async () => {
        await setupDb();
    })

    describe('POST /api/v1/users/register', () => {

        test('should create a new user account with no wallet', async ()  => {
            const userData2 = {
                username: 'moks',
                name: 'moks Chuku',
                email: 'moks@gmail.com',
                password: 'password',
            };

            const res = await request(app)
                .post('/api/v1/users/register')
                .send(userData2)
                .expect(200);

            expect(res.body.success).toBe(true);
            expect(res.body.message).toEqual('User has been added');
            expect(res.body.user).toHaveProperty('username', 'moks');
            expect(res.body.user).toHaveProperty('email', 'moks@gmail.com');
            expect(res.body.user).toHaveProperty('created');
        });

        test('should create a new user account', async () => {
            const userData = {
                username: 'david',
                name: 'David Chuku',
                email: 'david@gmail.com',
                password: 'password',
            };


            const res = await request(app)
                .post('/api/v1/users/register')
                .send(userData)
                .expect(200);

            expect(res.body.success).toBe(true);
            expect(res.body.message).toEqual('User has been added');
            expect(res.body.user).toHaveProperty('username', 'david');
            expect(res.body.user).toHaveProperty('email', 'david@gmail.com');
            expect(res.body.user).toHaveProperty('created');

        });

        // For the purpose of transfer (Act as beneficiary)
        test('should create a new user for any number of people', async () => {
            const userData = {
                username: 'zay',
                name: 'zay boss',
                email: 'zay@gmail.com',
                password: 'password',
            };


            const zay = await request(app)
                .post('/api/v1/users/register')
                .send(userData)
                .expect(200);

            expect(zay.body.success).toBe(true);
            expect(zay.body.message).toEqual('User has been added');
            expect(zay.body.user).toHaveProperty('username', 'zay');
            expect(zay.body.user).toHaveProperty('email', 'zay@gmail.com');
            expect(zay.body.user).toHaveProperty('created');

        });


        test('should return an error if the email is already in use', async () => {
            const userData = {
                username: 'davido',
                name: 'David Chuku',
                email: 'david@gmail.com',
                password: 'password',
            };

            const res = await request(app)
                .post('/api/v1/users/register')
                .send(userData)
                .expect(409);

            expect(res.body.success).toBe(false);
            expect(res.body.message).toEqual('Email already exists');
        });

        test('should return an error if the username is already in use', async () => {
            const userData = {
                username: 'david',
                name: 'chuku Chuku',
                email: 'ghost@gmail.com',
                password: 'password',
            };

            const res = await request(app)
                .post('/api/v1/users/register')
                .send(userData)
                .expect(409);

            expect(res.body.success).toBe(false);
            expect(res.body.message).toEqual('Username already exists');
        });
    });

    describe('POST /api/v1/users/login', () => {
        test('should return a JWT token if the login is successful', async () => {
            const loginData = {
                username: 'david',
                password: 'password',
            };

            const res = await request(app)
                .post('/api/v1/users/login')
                .send(loginData)
                .expect(200);

            expect(res.body.success).toBe(true);
            expect(res.body.username).toEqual('david');
            expect(typeof res.body.token).toBe('string');
        });

        test('should return an error if the login fails', async () => {
            const loginData = {
                username: 'ikechuku',
                password: 'jonser',
            };

            const res = await request(app)
                .post('/api/v1/users/login')
                .send(loginData)
                .expect(400);

            expect(res.body.success).toBe(false);
            expect(res.body.message).toEqual('Invalid credentials');
        });
    });


    afterAll(() => {
        knexInstance.destroy()
    })
})
