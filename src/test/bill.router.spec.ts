import { __ } from 'i18n';
import { SuperTest, Test } from 'supertest';
import { Customer } from '../entity/customer';
import { Application } from '../lib/application';
import { AuthService } from '../service/authService';
import { CustomerService } from '../service/customer.service';
import { UserService } from '../service/user.service';

describe('The Bill Router', () => {
    let app: SuperTest<Test>;
    let adminToken: string;
    let chefToken: string;
    let staffToken: string;
    let customer: Customer;
    let newBillId: number;
    let voucherCode: string;
    const discountCode: string = 'TEST_BILL';

    beforeAll(async () => {
        try {
            app = await Application.getTestApp();
            adminToken = AuthService.sign(await UserService.getOne({username: 'admin'}));
            chefToken = AuthService.sign(await UserService.getOne({username: 'chef'}));
            staffToken = AuthService.sign(await UserService.getOne({username: 'staff'}));
            customer = await CustomerService.getOne({ username: 'customer' });
        } catch (error) {
            console.error(error);
        }
    });

    describe('when create bill', () => {

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

        it('should return OK status and json object', () => {
            return app
                .post('/api/bills')
                .set({
                    Authorization: adminToken
                })
                .send({
                    tableNumber: 1,
                    dishIds: [1, 2],
                    storeId: 1,
                    dishNotes: ['Khong hanh', 'Khong kho hoa'],
                    dishQuantities: [3, 1],
                    voucherCode,
                    discountCode,
                    note: 'Hoa don cho dai gia, lam cho dang hoang',
                    customerUuid: customer.uuid,
                    rating: 4.5,
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body).toMatchObject({
                        tableNumber: 1,
                        createBy: {
                            username: 'admin'
                        },
                        store: { id: 1 },
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
                        note: 'Hoa don cho dai gia, lam cho dang hoang',
                        rating: 4.5,
                    });
                    newBillId = res.body.id;
                });
        });
    });

    describe('when create bill like a staff', () => {
        it('should return OK status and json object', () => {
            return app
                .post('/api/bills/restrict')
                .set({
                    Authorization: staffToken
                })
                .send({
                    tableNumber: 1,
                    dishIds: [1, 2],
                    storeId: 1,
                    dishNotes: ['Khong hanh', 'Khong kho hoa'],
                    dishQuantities: [3, 1],
                    voucherCode,
                    discountCode,
                    note: 'Hoa don cho dai gia, lam cho dang hoang',
                    customerUuid: null,
                    rating: 4.5,
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body).toMatchObject({
                        tableNumber: 1,
                        createBy: {
                            username: 'staff'
                        },
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

    describe('when get bill info', () => {
        it('should return OK status', () => {
            return app
                .get('/api/bills/' + newBillId + '?showDishesType=dishes&withCreateBy=true&withPrepareBy=true&withCollectBy=true&withCustomer=true')
                .set({
                    Authorization: adminToken
                })
                .expect((res) => {
                    expect(res.body).toMatchObject({
                        tableNumber: 1,
                        createBy: {
                            username: 'admin'
                        },
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
                        note: 'Hoa don cho dai gia, lam cho dang hoang',
                        rating: 4.5,
                    });
                });
        });
    });

    describe('when get all bills', () => {
        describe('with normal mode', () => {
            it('should return OK status and json array', () => {
                return app
                    .get('/api/bills')
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

    describe('when prepare bill as chef', () => {
        it('should return OK status and json object with new info', () => {
            return app
                .put(`/api/bills/${newBillId}/prepare`)
                .set({
                    Authorization: chefToken
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body).toMatchObject(
                        {
                            prepareBy: {
                                username: 'chef'
                            }
                        }
                    );
                });
        });
    });

    describe('when prepared one bill dish as chef', () => {
        describe('try as staff', () => {
            it('401 error', () => {
                return app
                    .put(`/api/bills/${newBillId}/prepared/1`)
                    .set({
                        Authorization: staffToken
                    })
                    .expect(401);
            });
        });

        describe('one bill dish', () => {
            it('should return OK status and json object with new info', () => {
                return app
                    .put(`/api/bills/${newBillId}/prepared/1`)
                    .set({
                        Authorization: chefToken
                    })
                    .expect(200);
            });
        });

        describe('all bill dish', () => {
            it('should return OK status and json object with new info', () => {
                return app
                    .put(`/api/bills/${newBillId}/prepared`)
                    .set({
                        Authorization: chefToken
                    })
                    .expect(200);
            });
        });
    });

    describe('when delivered one bill dish as staff', () => {
        describe('one bill dish', () => {
            it('should return OK status and json object with new info', () => {
                return app
                    .put(`/api/bills/${newBillId}/delivered/1`)
                    .set({
                        Authorization: staffToken
                    })
                    .expect(200);
            });
        });

        describe('all bill dish', () => {
            it('should return OK status and json object with new info', () => {
                return app
                    .put(`/api/bills/${newBillId}/delivered`)
                    .set({
                        Authorization: staffToken
                    })
                    .expect(200);
            });
        });
    });

    describe('when staff change dish', () => {
        it('should return success status', () => {
            return app
                .put(`/api/bills/${newBillId}/change-dish`)
                .set({
                    Authorization: staffToken
                })
                .send({
                    dishIds: [1, 2, 3],
                    dishNotes: [null, null, 'It'],
                    dishQuantities: [null, null, 3],
                    note: 'Bo m thich'
                })
                .expect(200);
        });
    });

    describe('when collect bill as staff', () => {
        it('should return OK status and json object with new info', () => {
            return app
                .put(`/api/bills/${newBillId}/collect`)
                .set({
                    Authorization: staffToken
                })
                .send({
                    collectValue: 20000,
                    note: 'Khach hang ko chiu tra du tien'
                })
                .expect(200);
        });
    });

    describe('when staff change dish', () => {
        it('can not change dish of colleted bill', () => {
            return app
                .put(`/api/bills/${newBillId}/change-dish`)
                .set({
                    Authorization: staffToken
                })
                .send({
                    dishIds: [1, 2, 3],
                    dishNotes: [null, null, 'It'],
                    dishQuantities: [null, null, 3],
                    note: 'Bo m thich'
                })
                .expect(500)
                .expect((res) => {
                    expect(res.body).toMatchObject(
                        { message: __('bill.bill_is_collected') }
                    );
                });
        });
    });

    describe('when staff assign customer', () => {
        it('should return 200 status', () => {
            return app
                .put(`/api/bills/${newBillId}/customer`)
                .set({
                    Authorization: staffToken
                })
                .send({
                    customerUuid: customer.uuid
                })
                .expect(200);
        });
    });

    describe('when update bill as admin', () => {
        it('should return OK status and json object with new info', () => {
            return app
                .put('/api/bills/' + newBillId)
                .set({
                    Authorization: adminToken
                })
                .send({
                    tableNumber: 2,
                    dishIds: [1, 2],
                    dishNotes: [null, 'Khong gia'],
                    dishQuantities: [null, 2],
                    voucherCode: '',
                    discountCode: '',
                    note: 'No note',
                    customerUuid: '',
                    rating: 4,
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body).toMatchObject(
                        {
                            tableNumber: 2,
                            createBy: {
                                username: 'admin'
                            },
                            updateBy: {
                                username: 'admin'
                            },
                            customer: null,
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

    describe('when delete bill', () => {
        describe('exist bill', () => {
            it('should return OK status', () => {
                return app
                    .delete('/api/bills/' + newBillId)
                    .set({
                        Authorization: adminToken
                    })
                    .expect(res => expect(res.status).toBe(200));
            });
        });

        describe('not found bill', () => {
            it('should return 500 error code', () => {
                return app
                    .delete('/api/bills/0')
                    .set({
                        Authorization: adminToken
                    })
                    .expect(res => expect(res.status).toBe(500));
            });
        });
    });
});
