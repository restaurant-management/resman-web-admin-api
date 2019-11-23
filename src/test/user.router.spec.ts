import jwt from 'jsonwebtoken';
import { SuperTest, Test } from 'supertest';
import { User } from '../entity/user';
import { Application } from '../lib/application';

describe('The User Router', () => {
    let app: SuperTest<Test>;
    let adminToken: string;
    let newUserId: number;

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
                        expect(res.body.length)
                            .toBeGreaterThanOrEqual(0);
                    });
            });
        });
    });

    describe('when create user', () => {
        it('should return OK status and json object', () => {
            return app
                .post('/api/users')
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
                    newUserId = res.body.id;
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
                .put('/api/users/' + newUserId)
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
                            id: newUserId,
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
                    .delete('/api/users/4')
                    .set({
                        Authorization: adminToken
                    })
                    .expect(res => expect(res.status).toBe(200));
            });
        });

        describe('not found user', () => {
            it('should return 500 error code', () => {
                return app
                    .delete('/api/users/5')
                    .set({
                        Authorization: adminToken
                    })
                    .expect(res => expect(res.status).toBe(500));
            });
        });

        describe('default admin user', () => {
            it('should return 500 error code', () => {
                return app
                    .delete('/api/users/1')
                    .set({
                        Authorization: adminToken
                    })
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
