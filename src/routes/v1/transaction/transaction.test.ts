import request from 'supertest';
import {app} from "../../../app";
import {Utils} from "../../../utils/utils";



describe('Testing Demo Credit Trx API', () => {
    beforeEach(async () => {
        const res = await request(app)
            .post('/api/v1/users/login')
            .send({username: 'david', password: 'password'});
        global.token = res.body.token;

        const res2 = await request(app)
            .post('/api/v1/users/login')
            .send({username: 'moks', password: 'password'});
        global.token_with_no_wallet = res2.body.token;

        // Beneficiary for testing transfer
        const res3 = await request(app)
            .post('/api/v1/users/login')
            .send({username: 'zay', password: 'password'});
        global.valid_token = res3.body.token;
    });

    describe('POST /api/v1/wallets/', () => {
        it('should create a wallet account', async () => {
            const res = await request(app)
                .post('/api/v1/wallets')
                .send({initial_deposit: 100})
                .set('Authorization', `Bearer ${global.token}`)
                .expect(201);

            expect(res.body.success).toBe(true);
            expect(res.body.message).toEqual('Account has been created successfully');
        })

        test('should return an error if the user already has an account', async () => {
            const res = await request(app)
                .post('/api/v1/wallets')
                .send({ initial_deposit: 100 })
                .set('Authorization', `Bearer ${global.token}`)
                .expect(409);

            expect(res.body.success).toBe(false);
            expect(res.body.message).toEqual('User already has an account');
        });
    });

    describe('POST /api/v1/wallets/fund', () => {
        it('should fund the wallet balance', async () => {
            const res = await request(app)
                .post('/api/v1/wallets/fund')
                .send({ amount: 50 })
                .set('Authorization', `Bearer ${global.token}`)
                .expect(200);

            expect(res.body.success).toBe(true);
            expect(res.body.message).toEqual('Wallet was funded successfully');
        });

        it('should return an error if the user does not have an account', async () => {
            const res = await request(app)
                .post('/api/v1/wallets/fund')
                .send({ amount: 50 })
                .set('Authorization', `Bearer ${global.token_with_no_wallet}`)
                .expect(404);

            expect(res.body.success).toBe(false);
            expect(res.body.message).toEqual('User does not have an account');
        });

        it('should return an error if an error occurs while funding the wallet', async () => {
            const res = await request(app)
                .post('/api/v1/wallets/fund')
                // .send({ amount: '50' })
                .set('Authorization', `Bearer ${global.token}`)
                .expect(500);

            expect(res.body.success).toBe(false);
            expect(res.body.message).toMatch('An error occurred while attempting to fund wallet');
        });
    });

    describe('POST /api/v1/wallets/withdraw', () => {
            it('should withdraw from the wallet balance', async () => {
                const res = await request(app)
                    .post('/api/v1/wallets/withdraw')
                    .send({ amount: 50 })
                    .set('Authorization', `Bearer ${global.token}`)
                    .expect(200);

                expect(res.body.success).toBe(true);
                expect(res.body.message).toEqual('Withdrawal was successful');
            });

            it('should return an error if the user does not have an account', async () => {
                const res = await request(app)
                    .post('/api/v1/wallets/withdraw')
                    .send({ amount: 50 })
                    .set('Authorization', `Bearer ${global.token_with_no_wallet}`)
                    .expect(404);

                expect(res.body.success).toBe(false);
                expect(res.body.message).toEqual('User does not have an account');
            });

            it('should return an error if the balance is insufficient', async () => {
                const res = await request(app)
                    .post('/api/v1/wallets/withdraw')
                    .send({ amount: 500 })
                    .set('Authorization', `Bearer ${global.token}`)
                    .expect(400);

                expect(res.body.success).toBe(false);
                expect(res.body.message).toEqual('Insufficient balance');
            });

            it('should return an error if an error occurs while withdrawing from the wallet', async () => {
                const res = await request(app)
                    .post('/api/v1/wallets/withdraw')
                    // .send({ amount: 50 })
                    .set('Authorization', `Bearer ${global.token}`)
                    .expect(500);

                expect(res.body.success).toBe(false);
                expect(res.body.message).toEqual('An error occurred while attempting to withdraw from wallet');
            });
        });

    describe('POST /api/v1/wallets/transfer', () => {
        it('should return an error if sender does not have an account', async() => {
            const res = await request(app)
                .post('/api/v1/wallets/transfer')
                .send({amount: 20, beneficiary_account: '0000000018', narration: ''})
                .set('Authorization', `Bearer ${global.token_with_no_wallet}`)
                .expect(404);

            expect(res.body.message).toEqual('Sender must have an account');

        });

        it('should return an error if beneficiary account does not exist', async() => {
            const res = await request(app)
                .post('/api/v1/wallets/transfer')
                .send({amount: 20, beneficiary_account: '00000018', narration: ''})
                .set('Authorization', `Bearer ${global.token}`)
                .expect(404);
            expect(res.body.message).toEqual('Beneficiary account not found');

        });

        // Beneficiary account setup
        it('creating setup for beneficiary account', async () => {
            const res = await request(app)
                .post('/api/v1/wallets')
                .send({initial_deposit: 100})
                .set('Authorization', `Bearer ${global.valid_token}`)
                .expect(201);

            expect(res.body.success).toBe(true);
            expect(res.body.message).toEqual('Account has been created successfully');
        });

        it('should successfully transfer funds', async() => {
            const res = await request(app)
                .post('/api/v1/wallets/transfer')
                .send({amount: 20, beneficiary_account: `${await Utils.generateAccountNumber(3)}`, narration: ''})
                .set('Authorization', `Bearer ${global.token}`)
                .expect(200);
            expect(res.body.message).toEqual('Transfer was successful');

        });


    })


    });



