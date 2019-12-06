import { SuperTest, Test } from 'supertest';
import { Application } from '../lib/application';
import { AuthService } from '../service/authService';
import { UserService } from '../service/user.service';

describe('The User Router', () => {
    let app: SuperTest<Test>;
    let adminToken: string;
    let staffToken: string;
    let newUsername: string;

    beforeAll(async (done) => {
        app = await Application.getTestApp();
        adminToken = AuthService.sign(await UserService.getOne({ username: 'admin' }));
        staffToken = AuthService.sign(await UserService.getOne({ username: 'staff' }));
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
                    newUsername = 'test';
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

    describe('when user change password', () => {
        let userToken = '';

        it('login with old password', () => {
            return app
                .post('/api/users/login')
                .send({
                    password: 'test',
                    usernameOrEmail: 'test',
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body).toEqual(expect.stringMatching(/.*\..*\..*/));
                    userToken = res.body;
                });
        });

        it('should return OK status', () => {
            return app.
                patch('/api/users/password')
                .set({
                    Authorization: userToken
                })
                .send({
                    oldPassword: 'test',
                    newPassword: 'new_test'
                })
                .expect(200);
        });

        it('login again with new password', () => {
            return app
                .post('/api/users/login')
                .send({
                    password: 'new_test',
                    usernameOrEmail: 'test',
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body).toEqual(expect.stringMatching(/.*\..*\..*/));
                });
        });
    });

    describe('when edit profile by owner', () => {
        it('should return OK status and json object with new info', () => {
            return app
                .put('/api/users/staff')
                .set({
                    Authorization: staffToken
                })
                .send({
                    password: 'test',
                    phoneNumber: '011111',
                    address: 'test',
                    fullName: 'hierenlee',
                    avatar: 'avatar',
                    birthday: new Date(1998, 1, 1)
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body).toMatchObject(
                        {
                            address: 'test',
                            avatar: 'avatar',
                            birthday: new Date(1998, 1, 1).toISOString(),
                            fullName: 'hierenlee',
                            phoneNumber: '011111',
                            username: 'staff'
                        }
                    );
                });
        });
    })

    describe('when update user', () => {
        it('should return OK status and json object with new info', () => {
            return app
                .put('/api/users/' + newUsername)
                .set({
                    Authorization: adminToken
                })
                .send({
                    password: 'test',
                    phoneNumber: '011112',
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
                            address: newUsername,
                            avatar: 'avatar',
                            birthday: new Date(1998, 1, 1).toISOString(),
                            fullName: 'hierenlee',
                            phoneNumber: '011112',
                            roles: [{
                                slug: 'administrator'
                            }]
                        }
                    );
                });
        });
    });

    describe('when get user', () => {
        describe('get by id', () => {
            it('should return OK status', () => {
                return app
                    .get('/api/users/' + newUsername + '?withRoles=true&withStores=true&withWarehouses=true')
                    .set({
                        Authorization: adminToken
                    })
                    .expect((res) => {
                        expect(res.body).toMatchObject(
                            {
                                username: newUsername
                            }
                        );
                    });
            });
        });
    });

    describe('when delete user', () => {
        describe('normal user', () => {
            it('should return OK status', () => {
                return app
                    .delete('/api/users/' + newUsername)
                    .set({
                        Authorization: adminToken
                    })
                    .expect(res => expect(res.status).toBe(200));
            });
        });

        describe('not found user', () => {
            it('should return 500 error code', () => {
                return app
                    .delete('/api/users/notfound')
                    .set({
                        Authorization: adminToken
                    })
                    .expect(res => expect(res.status).toBe(500));
            });
        });

        describe('default admin user', () => {
            it('should return 500 error code', () => {
                return app
                    .delete('/api/users/admin')
                    .set({
                        Authorization: adminToken
                    })
                    .expect(res => expect(res.status).toBe(500));
            });
        });
    });
});
