import { getLocale } from 'i18n';
import { SuperTest, Test } from 'supertest';
import { Customer } from '../entity/customer';
import { User } from '../entity/user';
import { Application } from '../lib/application';
import { AuthService } from '../service/authService';
import { CustomerService } from '../service/customer.service';
import { UserService } from '../service/user.service';

describe('The Delivery Bill Router', () => {
    let app: SuperTest<Test>;
    let adminToken: string;
    let chefUser: User;
    let chefToken: string;
    let shipperUser: User;
    let shipperToken: string;
    let customer: Customer;
    let customerToken: string;
    let addressId: number;
    let newDeliveryBillId: number;
    let voucherCode: string;
    const discountCode: string = 'TEST_DE_BI';

    beforeAll(async () => {
        try {
            app = await Application.getTestApp();
            adminToken = AuthService.sign(await UserService.getOne({ username: 'admin' }));
            chefUser = await UserService.getOne({ username: 'chef' });
            chefToken = AuthService.sign(chefUser);
            shipperUser = await UserService.getOne({ username: 'shipper' });
            shipperToken = AuthService.sign(shipperUser);

            customer = await CustomerService.getOne({ username: 'customer' });
            customerToken = AuthService.sign(customer);
        } catch (error) {
            console.error(error);
            console.log(chefToken, shipperToken, customerToken);
        }
    });

    describe('when create delivery bill by admin', () => {

        it('create voucher code for testing', () => {
            return app
                .post('/api/voucher_codes')
                .set({
                    Authorization: adminToken
                })
                .send({
                    name: 'Test VoucherCode',
                    startAt: new Date(1998, 1, 1),
                    endAt: new Date(2098, 1, 1),
                    value: 10,
                    storeIds: [1],
                    description: 'Test VoucherCode Description',
                    image: 'image',
                    minBillPrice: 200000,
                    maxPriceDiscount: 120000,
                    isActive: true,
                    discountCode,
                    isPercent: true
                })
                .expect(200)
                .expect(res => {
                    voucherCode = res.body.code;
                });
        });

        it('create discount code for testing', () => {
            return app
                .post('/api/discount_codes')
                .set({
                    Authorization: adminToken
                })
                .send({
                    code: discountCode,
                    name: 'Test Discount Code',
                    startAt: new Date(1998, 1, 1),
                    endAt: new Date(2098, 1, 1),
                    discount: 10,
                    storeIds: [1],
                    description: 'Test Discount Code Description',
                    minBillPrice: 200000,
                    maxPriceDiscount: 120000,
                    maxNumber: 20,
                    isActive: true
                })
                .expect(200);
        });

        it('create customer address for testing', () => {
            return app
                .post(`/api/customers/${customer.username}/addresses`)
                .set({
                    Authorization: adminToken
                })
                .send({
                    address: 'address',
                    longitude: 10.342,
                    latitude: 10.222
                })
                .expect(200)
                .expect((res) => {
                    addressId = res.body.id;
                    expect(res.body).toMatchObject({
                        address: 'address',
                        longitude: 10.342,
                        latitude: 10.222,
                        customer: {
                            username: customer.username
                        }
                    });
                });
        });

        it('should return OK status and json object', () => {
            const today = new Date();

            return app
                .post('/api/delivery_bills')
                .set({
                    Authorization: adminToken
                })
                .send({
                    dishIds: [1, 2],
                    storeId: 1,
                    customerUuid: customer.uuid,
                    addressId,
                    createAt: today,
                    prepareAt: today,
                    prepareByUuid: chefUser.uuid,
                    preparedAt: today,
                    shipAt: today,
                    shipByUuid: shipperUser.uuid,
                    collectAt: today,
                    collectValue: 20000,
                    voucherCode,
                    discountCode,
                    rating: 4.5,
                    note: 'Hoa don cho dai gia, lam cho dang hoang',
                    dishNotes: ['Khong hanh', 'Khong kho hoa'],
                    dishQuantities: [3, 1],
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body).toMatchObject({
                        createAt: today.toJSON(),
                        prepareAt: today.toJSON(),
                        preparedAt: today.toJSON(),
                        shipAt: today.toJSON(),
                        collectAt: today.toJSON(),
                        collectValue: Intl.NumberFormat(getLocale(), { style: 'currency', currency: 'USD' })
                            .format(20000),
                        customer: { uuid: customer.uuid },
                        prepareBy: {
                            uuid: chefUser.uuid
                        },
                        shipBy: {
                            uuid: shipperUser.uuid
                        },
                        address: 'address',
                        voucherCode,
                        voucherValue: 10,
                        discountCode,
                        discountValue: 10,
                        dishes: [
                            {
                                dishId: 1,
                                note: 'Khong hanh',
                                quantity: 3
                            },
                            {
                                dishId: 2,
                                note: 'Khong kho hoa',
                                quantity: 1
                            }
                        ],
                        note: 'Hoa don cho dai gia, lam cho dang hoang',
                        rating: 4.5,
                    });
                });
        });
    });

    describe('when create delivery bill as a customer', () => {
        it('should return OK status and json object', () => {
            return app
                .post('/api/delivery_bills/restrict')
                .set({
                    Authorization: customerToken
                })
                .send({
                    dishIds: [1, 2],
                    storeId: 1,
                    addressId,
                    dishNotes: ['Khong hanh', 'Khong kho hoa'],
                    dishQuantities: [3, 1],
                    voucherCode,
                    discountCode,
                    note: 'Hoa don cho dai gia, lam cho dang hoang'
                })
                .expect(200)
                .expect((res) => {
                    newDeliveryBillId = res.body.id;
                    expect(res.body).toMatchObject({
                        customer: {
                            uuid: customer.uuid
                        },
                        address: 'address',
                        voucherCode,
                        voucherValue: 10,
                        discountCode,
                        discountValue: 10,
                        dishes: [
                            {
                                dishId: 1,
                                note: 'Khong hanh',
                                quantity: 3
                            },
                            {
                                dishId: 2,
                                note: 'Khong kho hoa',
                                quantity: 1
                            }
                        ],
                        note: 'Hoa don cho dai gia, lam cho dang hoang'
                    });
                });
        });
    });

    describe('when get delivery bill info', () => {
        it('should return OK status', () => {
            return app
                .get('/api/delivery_bills/' + newDeliveryBillId + '?withCustomer=true&withPrepareBy=true&withShipBy=true&withDishes=true&withStore=true')
                .set({
                    Authorization: adminToken
                })
                .expect((res) => {
                    expect(res.body).toMatchObject({
                        customer: { uuid: customer.uuid },
                        voucherCode,
                        voucherValue: 10,
                        discountCode,
                        discountValue: 10,
                        dishes: [
                            {
                                dishId: 1,
                                note: 'Khong hanh',
                                quantity: 3
                            },
                            {
                                dishId: 2,
                                note: 'Khong kho hoa',
                                quantity: 1
                            }
                        ],
                        store: { id: 1 },
                        note: 'Hoa don cho dai gia, lam cho dang hoang',
                    });
                });
        });
    });

    describe('when get all delivery bills', () => {
        describe('with normal mode', () => {
            it('should return OK status and json array', () => {
                return app
                    .get('/api/delivery_bills')
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

    describe('when prepare delivery bill as chef', () => {
        it('should return OK status and json object with new info', () => {
            return app
                .put(`/api/delivery_bills/${newDeliveryBillId}/prepare`)
                .set({
                    Authorization: chefToken
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body).toMatchObject(
                        {
                            prepareAt: expect.stringMatching(/.*/),
                            prepareBy: {
                                username: 'chef'
                            }
                        }
                    );
                });
        });
    });

    describe('when finish preparing delivery bill dish as chef', () => {
        describe('try as shipper', () => {
            it('401 error', () => {
                return app
                    .put(`/api/delivery_bills/${newDeliveryBillId}/prepared`)
                    .set({
                        Authorization: shipperToken
                    })
                    .expect(401);
            });
        });

        describe('try as chef', () => {
            it('should return OK status and json object with new info', () => {
                return app
                    .put(`/api/delivery_bills/${newDeliveryBillId}/prepared`)
                    .set({
                        Authorization: chefToken
                    })
                    .expect(200)
                    .expect((res) => {
                        expect(res.body).toMatchObject(
                            {
                                prepareBy: {
                                    username: 'chef'
                                },
                                prepareAt: expect.stringMatching(/.*/),
                                preparedAt: expect.stringMatching(/.*/)
                            }
                        );
                    });
            });
        });
    });

    describe('when ship delivery bill as shipper', () => {
        it('should return OK status and json object with new info', () => {
            return app
                .put(`/api/delivery_bills/${newDeliveryBillId}/ship`)
                .set({
                    Authorization: shipperToken
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body).toMatchObject(
                        {
                            prepareBy: {
                                username: 'chef'
                            },
                            prepareAt: expect.stringMatching(/.*/),
                            preparedAt: expect.stringMatching(/.*/),
                            shipBy: {
                                username: 'shipper',
                            },
                            shipAt: expect.stringMatching(/.*/)
                        }
                    );
                });
        });
    });

    describe('when collect delivery bill as shipper', () => {
        it('should return OK status and json object with new info', () => {
            return app
                .put(`/api/delivery_bills/${newDeliveryBillId}/collect`)
                .set({
                    Authorization: shipperToken
                })
                .send({
                    collectValue: 0,
                    note: 'Khach hang BOM'
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body).toMatchObject(
                        {
                            prepareBy: {
                                username: 'chef'
                            },
                            prepareAt: expect.stringMatching(/.*/),
                            preparedAt: expect.stringMatching(/.*/),
                            shipBy: {
                                username: 'shipper',
                            },
                            shipAt: expect.stringMatching(/.*/),
                            collectAt: expect.stringMatching(/.*/),
                            collectValue: Intl.NumberFormat(getLocale(), { style: 'currency', currency: 'USD' })
                                .format(0),
                            note: 'Khach hang BOM'
                        }
                    );
                });
        });
    });

    describe('when rate delivery bill as customer', () => {
        it('should return OK status', () => {
            return app
                .put(`/api/delivery_bills/${newDeliveryBillId}/rating`)
                .set({
                    Authorization: customerToken
                })
                .send({
                    rating: 3
                })
                .expect(200);
        });
    });

    describe('when update delivery bill as admin', () => {
        it('should remove some info if pass empty string', () => {
            const someDay = new Date(2019, 1, 2, 12, 12);

            return app
                .put('/api/delivery_bills/' + newDeliveryBillId)
                .set({
                    Authorization: adminToken
                })
                .send({
                    prepareAt: someDay,
                    prepareByUuid: '',
                    shipAt: someDay,
                    shipByUuid: '',
                    collectAt: someDay,
                    collectValue: 10000,
                    addressId,
                    dishIds: [1, 2],
                    dishNotes: [null, 'Khong gia'],
                    dishQuantities: [null, 2],
                    voucherCode: '',
                    discountCode: '',
                    note: 'No note',
                    rating: 4,
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body).toMatchObject(
                        {
                            prepareAt: null,
                            prepareBy: null,
                            shipAt: null,
                            shipBy: null,
                            collectAt: null,
                            collectValue: null,
                            address: 'address',
                            voucherCode: null,
                            voucherValue: null,
                            discountCode: null,
                            discountValue: null,
                            dishes: [
                                {
                                    dishId: 1,
                                    note: 'Khong hanh',
                                    quantity: 3
                                },
                                {
                                    dishId: 2,
                                    note: 'Khong gia',
                                    quantity: 2
                                }
                            ],
                            note: 'No note',
                            rating: 4,
                        }
                    );
                });
        });
    });

    describe('when delete delivery bill', () => {
        describe('exist delivery bill', () => {
            it('should return OK status', () => {
                return app
                    .delete('/api/delivery_bills/' + newDeliveryBillId)
                    .set({
                        Authorization: adminToken
                    })
                    .expect(res => expect(res.status).toBe(200));
            });
        });

        describe('not found delivery bill', () => {
            it('should return 500 error code', () => {
                return app
                    .delete('/api/delivery_bills/0')
                    .set({
                        Authorization: adminToken
                    })
                    .expect(res => expect(res.status).toBe(500));
            });
        });
    });
});
