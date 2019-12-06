import { SuperTest, Test } from 'supertest';
import { Application } from '../lib/application';
import { AuthService } from '../service/authService';
import { UserService } from '../service/user.service';

describe('The Customer Router', () => {
    let app: SuperTest<Test>;
    let adminToken: string;
    const newCustomerByAdmin: string = 'test';
    const newCustomerByRegister: string = 'hieren_lee';
    let newCustomerByRegisterToken: string;

    beforeAll(async () => {
        try {
            app = await Application.getTestApp();
            adminToken = AuthService.sign(await UserService.getOne({ username: 'admin' }));
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

    describe('when customer register', () => {
        it('should return OK status and a token', () => {
            return app
                .post('/api/customers/register')
                .send({
                    username: newCustomerByRegister,
                    email: 'gaphagun12@gmail.com',
                    password: newCustomerByRegister,
                    phoneNumber: '16520361',
                    fullName: 'Hieren Lee',
                    avatar: 'Avatar',
                    birthday: new Date(2019, 1, 1)
                })
                .expect(200)
                .expect(res => {
                    expect(res.body).toMatchObject(
                        {
                            username: newCustomerByRegister,
                            email: 'gaphagun12@gmail.com',
                            phoneNumber: '16520361',
                            fullName: 'Hieren Lee',
                            avatar: 'Avatar',
                            birthday: new Date(2019, 1, 1).toJSON()
                        }
                    );
                });
        });

        it('login to get token to change password', () => {
            return app
                .post('/api/customers/login')
                .send({
                    usernameOrEmail: newCustomerByRegister,
                    password: newCustomerByRegister
                })
                .expect(200)
                .expect(res => {
                    expect(res.body).toEqual(expect.stringMatching(/.*\..*\..*/));
                    newCustomerByRegisterToken = res.body;
                });
        });
    });

    describe('when customer change password', () => {
        it('should return OK status and a token', () => {
            return app
                .patch('/api/customers/password')
                .set({
                    Authorization: newCustomerByRegisterToken
                })
                .send({
                    oldPassword: newCustomerByRegister,
                    newPassword: 'customer',
                })
                .expect(200);
        });

        it('login with new password', () => {
            return app
                .post('/api/customers/login')
                .send({
                    usernameOrEmail: newCustomerByRegister,
                    password: 'customer'
                })
                .expect(200)
                .expect(res => {
                    expect(res.body).toEqual(expect.stringMatching(/.*\..*\..*/));
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
                        expect(res.body.length)
                            .toBeGreaterThanOrEqual(0);
                    });
            });
        });
    });

    describe('when create customer', () => {
        it('should return OK status and json object', () => {
            return app
                .post('/api/customers')
                .set({
                    Authorization: adminToken
                })
                .send({
                    username: newCustomerByAdmin,
                    email: 'test@gmail.com',
                    password: 'test',
                    phoneNumber: '099999',
                    fullName: 'Hieren Lee',
                    avatar: 'Avatar',
                    birthday: new Date(2019, 1, 1)
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body).toMatchObject(
                        {
                            email: 'test@gmail.com',
                            phoneNumber: '099999',
                            username: 'test',
                            fullName: 'Hieren Lee',
                            avatar: 'Avatar',
                            birthday: new Date(2019, 1, 1).toJSON()
                        }
                    );
                });
        });
    });

    describe('when update customer', () => {
        it('should return OK status and json object with new info', () => {
            return app
                .put('/api/customers/' + newCustomerByAdmin)
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
                            username: newCustomerByAdmin,
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
        describe('get by username', () => {
            it('should return OK status', () => {
                return app
                    .get('/api/customers/' + newCustomerByAdmin)
                    .set({
                        Authorization: adminToken
                    })
                    .expect((res) => {
                        expect(res.body).toMatchObject(
                            {
                                username: newCustomerByAdmin
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
                    .delete('/api/customers/' + newCustomerByAdmin)
                    .set({
                        Authorization: adminToken
                    })
                    .expect(res => expect(res.status).toBe(200));
            });
        });

        describe('not found customer', () => {
            it('should return 500 error code', () => {
                return app
                    .delete('/api/customers/xyz')
                    .set({
                        Authorization: adminToken
                    })
                    .expect(res => expect(res.status).toBe(500));
            });
        });
    });
});
