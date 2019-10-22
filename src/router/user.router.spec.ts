import { SuperTest, Test } from 'supertest';
import { Application } from '../lib/application';

describe('The User Router', () => {
    let app: SuperTest<Test>;

    beforeAll(async (done) => {
        app = await Application.getTestApp();
        done();
    });

    describe('when user login', () => {
        describe('with username', () => {
            it('should return OK status and a token', () => {
                return app
                    .get('/api/users/login')
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
                    .get('/api/users/login')
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
                                        permissions: [
                                            'user.list',
                                            'user.create',
                                            'user.update',
                                            'user.delete',
                                            'user.import',
                                            'user.export',
                                            'role.list',
                                            'role.create',
                                            'role.update',
                                            'role.delete',
                                            'role.import',
                                            'role.export',
                                            'customer.list',
                                            'customer.create',
                                            'customer.update',
                                            'customer.delete',
                                            'customer.import',
                                            'customer.export',
                                            'store.list',
                                            'store.create',
                                            'store.update',
                                            'store.delete',
                                            'store.import',
                                            'store.export',
                                            'warehouse.list',
                                            'warehouse.create',
                                            'warehouse.update',
                                            'warehouse.delete',
                                            'warehouse.import',
                                            'warehouse.export',
                                            'discountCode.list',
                                            'discountCode.create',
                                            'discountCode.update',
                                            'discountCode.delete',
                                            'discountCode.import',
                                            'discountCode.export',
                                            'voucherCode.list',
                                            'voucherCode.create',
                                            'voucherCode.update',
                                            'voucherCode.delete',
                                            'voucherCode.import',
                                            'voucherCode.export',
                                            'discountCampaign.list',
                                            'discountCampaign.create',
                                            'discountCampaign.update',
                                            'discountCampaign.delete',
                                            'discountCampaign.import',
                                            'discountCampaign.export',
                                            'dish.list',
                                            'dish.create',
                                            'dish.update',
                                            'dish.delete',
                                            'dish.import',
                                            'dish.export',
                                            'dailyDish.list',
                                            'dailyDish.create',
                                            'dailyDish.update',
                                            'dailyDish.delete',
                                            'dailyDish.import',
                                            'dailyDish.export',
                                            'bill.list',
                                            'bill.create',
                                            'bill.update',
                                            'bill.delete',
                                            'bill.import',
                                            'bill.export',
                                            'deliveryBill.list',
                                            'deliveryBill.create',
                                            'deliveryBill.update',
                                            'deliveryBill.delete',
                                            'deliveryBill.import',
                                            'deliveryBill.export',
                                            'analysis.list',
                                            'analysis.create',
                                            'analysis.update',
                                            'analysis.delete',
                                            'analysis.import',
                                            'analysis.export',
                                            'stock.list',
                                            'stock.create',
                                            'stock.update',
                                            'stock.delete',
                                            'stock.import',
                                            'stock.export',
                                            'importBill.list',
                                            'importBill.create',
                                            'importBill.update',
                                            'importBill.delete',
                                            'importBill.import',
                                            'importBill.export',
                                            'dailyReport.list',
                                            'dailyReport.create',
                                            'dailyReport.update',
                                            'dailyReport.delete',
                                            'dailyReport.import',
                                            'dailyReport.export'
                                        ],
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
});
