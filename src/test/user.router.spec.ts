import jwt from 'jsonwebtoken';
import { SuperTest, Test } from 'supertest';
import { User } from '../entity/user';
import { Application } from '../lib/application';

describe('The User Router', () => {
    let app: SuperTest<Test>;
    let adminToken: string;

    beforeAll(async (done) => {
        app = await Application.getTestApp();
        adminToken = jwt.sign({ uuid: (await User.findOne(1)).uuid },
            process.env.JWT_SECRET_KEY, { expiresIn: `1 days` });
        done();
    });

    describe('when user login', () => {
        describe('with username', () => {
            it('should return OK status and a token', () => {
                return app
                    .post('/api/users/login')
                    .send({
                        password: 'admin',
                        usernameOrEmail: 'admin',
                    })
                    .expect(200)
                    .expect((res) => {
                        expect(res.body).toEqual(expect.stringMatching(/.*\..*\..*/));
                    });
            });
        });
        describe('with email', () => {
            it('should return OK status and a token', () => {
                return app
                    .post('/api/users/login')
                    .send({
                        password: 'admin',
                        usernameOrEmail: 'hienlh1298@gmail.com'
                    })
                    .expect(200)
                    .expect((res) => {
                        expect(res.body).toEqual(expect.stringMatching(/.*\..*\..*/));
                    });
            });
        });
    });

    describe('when get all users', () => {
        describe('with normal mode', () => {
            it('should return OK status and json array', () => {
                return app
                    .get('/api/users')
                    .set({
                        Authorization: adminToken
                    })
                    .expect(200)
                    .expect((res) => {
                        expect(res.body).toMatchObject([
                            {
                                address: 'Viet Nam',
                                avatar: null,
                                birthday: null,
                                email: 'hienlh1298@gmail.com',
                                fullName: null,
                                id: 1,
                                phoneNumber: '0123456789',
                                roles: [
                                    {
                                        description: null,
                                        id: 1,
                                        level: 5,
                                        name: 'Administrator',
                                        slug: 'administrator'
                                    }
                                ],
                                username: 'admin',
                                uuid: expect.stringMatching(/.*/)
                            },
                            {
                                address: 'Viet Nam',
                                avatar: null,
                                birthday: null,
                                email: 'staff@gmail.com',
                                fullName: null,
                                id: 2,
                                phoneNumber: '01231234234',
                                roles: [],
                                username: 'staff',
                                uuid: expect.stringMatching(/.*/)
                            },
                            {
                                address: 'Viet Nam',
                                avatar: null,
                                birthday: null,
                                email: 'chef@gmail.com',
                                fullName: null,
                                id: 3,
                                phoneNumber: '12323123',
                                roles: [],
                                username: 'chef',
                                uuid: expect.stringMatching(/.*/)
                            }
                        ]);
                    });
            });
        });
    });

    describe('when create user', () => {
        it('should return OK status and json object', () => {
            return app
                .post('/api/users/create')
                .set({
                    Authorization: adminToken
                })
                .send({
                    username: 'test',
                    email: 'test@gmail.com',
                    password: 'test',
                    phoneNumber: '099999',
                    address: 'test'
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body).toMatchObject(
                        {
                            address: 'test',
                            avatar: null,
                            birthday: null,
                            email: 'test@gmail.com',
                            fullName: null,
                            phoneNumber: '099999',
                            username: 'test'
                        }
                    );
                });
        });
    });

    describe('when update user', () => {
        it('should return OK status and json object with new info', () => {
            return app
                .put('/api/users/2/update')
                .set({
                    Authorization: adminToken
                })
                .send({
                    password: 'test',
                    phoneNumber: '011111',
                    address: 'test',
                    fullName: 'hierenlee',
                    avatar: 'avatar',
                    birthday: new Date(1998, 1, 1),
                    roles: ['administrator']
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body).toMatchObject(
                        {
                            id: 2,
                            address: 'test',
                            avatar: 'avatar',
                            birthday: new Date(1998, 1, 1).toISOString(),
                            fullName: 'hierenlee',
                            phoneNumber: '011111',
                            roles: [{
                                slug: 'administrator'
                            }]
                        }
                    );
                });
        });
    });

    describe('when delete user', () => {
        describe('normal user', () => {
            it('should return OK status', () => {
                return app
                    .delete('/api/users/4/delete')
                    .set({
                        Authorization: adminToken
                    })
                    .expect(res => expect(res.status).toBe(200));
            });
        });

        describe('not found user', () => {
            it('should return 500 error code', () => {
                return app
                    .delete('/api/users/4/delete')
                    .expect(res => expect(res.status).toBe(500));
            });
        });

        describe('default admin user', () => {
            it('should return 500 error code', () => {
                return app
                    .delete('/api/users/1/delete')
                    .expect(res => expect(res.status).toBe(500));
            });
        });
    });

    describe('when get user', () => {
        describe('get by id', () => {
            it('should return OK status', () => {
                return app
                    .get('/api/users/1')
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
});
