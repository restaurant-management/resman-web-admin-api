import jwt from 'jsonwebtoken';
import { SuperTest, Test } from 'supertest';
import { User } from '../entity/user';
import { Application } from '../lib/application';

describe('The Customer Router', () => {
    let app: SuperTest<Test>;
    let adminToken: string;

    beforeAll(async () => {
        try {
            app = await Application.getTestApp();
            adminToken = jwt.sign({ uuid: (await User.findOne(1)).uuid },
                process.env.JWT_SECRET_KEY, { expiresIn: `1 days` });
        } catch (error) {
            console.error(error);
        }
    });

    describe('when customer login', () => {
        describe('with username', () => {
            it('should return OK status and a token', () => {
                return app
                    .post('/api/customers/login')
                    .send({
                        usernameOrEmail: 'customer',
                        password: 'customer'
                    })
                    .expect(200)
                    .expect(res => {
                        expect(res.body).toEqual(expect.stringMatching(/.*\..*\..*/));
                    });
            });
        });
        describe('with email', () => {
            it('should return OK status and a token', () => {
                return app
                    .post('/api/customers/login')
                    .send({
                        usernameOrEmail: '16520361@gm.uit.edu.vn',
                        password: 'customer'
                    })
                    .expect(200)
                    .expect(res => {
                        expect(res.body).toEqual(expect.stringMatching(/.*\..*\..*/));
                    });
            });
        });
    });

    describe('when get all customers', () => {
        describe('with normal mode', () => {
            it('should return OK status and json array', () => {
                return app
                    .get('/api/customers')
                    .set({
                        Authorization: adminToken
                    })
                    .expect(200)
                    .expect((res) => {
                        expect(res.body).toMatchObject([
                            {
                                id: 1,
                                username: 'customer',
                                email: '16520361@gm.uit.edu.vn'
                            }
                        ]);
                    });
            });
        });
    });

    describe('when create customer', () => {
        it('should return OK status and json object', () => {
            return app
                .post('/api/customers/create')
                .set({
                    Authorization: adminToken
                })
                .send({
                    username: 'test',
                    email: 'test@gmail.com',
                    password: 'test',
                    phoneNumber: '099999'
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body).toMatchObject(
                        {
                            email: 'test@gmail.com',
                            phoneNumber: '099999',
                            username: 'test'
                        }
                    );
                });
        });
    });

    describe('when update customer', () => {
        it('should return OK status and json object with new info', () => {
            return app
                .put('/api/customers/1/update')
                .set({
                    Authorization: adminToken
                })
                .send({
                    password: 'test',
                    phoneNumber: '011111',
                    fullName: 'hierenlee',
                    avatar: 'avatar',
                    birthday: new Date(1998, 1, 1)
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body).toMatchObject(
                        {
                            id: 1,
                            avatar: 'avatar',
                            birthday: new Date(1998, 1, 1).toISOString(),
                            fullName: 'hierenlee',
                            phoneNumber: '011111'
                        }
                    );
                });
        });
    });

    describe('when get customer info', () => {
        describe('get by id', () => {
            it('should return OK status', () => {
                return app
                    .get('/api/customers/1')
                    .set({
                        Authorization: adminToken
                    })
                    .expect((res) => {
                        expect(res.body).toMatchObject(
                            {
                                id: 1
                            }
                        );
                    });
            });
        });
    });

    describe('when delete customer', () => {
        describe('normal user', () => {
            it('should return OK status', () => {
                return app
                    .delete('/api/customers/1/delete')
                    .set({
                        Authorization: adminToken
                    })
                    .expect(res => expect(res.status).toBe(200));
            });
        });

        describe('not found customer', () => {
            it('should return 500 error code', () => {
                return app
                    .delete('/api/customers/3/delete')
                    .set({
                        Authorization: adminToken
                    })
                    .expect(res => expect(res.status).toBe(500));
            });
        });
    });
});
