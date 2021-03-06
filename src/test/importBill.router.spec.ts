import jwt from 'jsonwebtoken';
import { SuperTest, Test } from 'supertest';
import { User } from '../entity/user';
import { Application } from '../lib/application';

describe('The ImportBill Router', () => {
    let app: SuperTest<Test>;
    let adminToken: string;
    let newWarehouseId: number;
    let newImportBillId: number;

    beforeAll(async () => {
        try {
            app = await Application.getTestApp();
            adminToken = jwt.sign({ uuid: (await User.findOne(1)).uuid },
                process.env.JWT_SECRET_KEY, { expiresIn: `1 days` });
        } catch (error) {
            console.error(error);
        }
    });

    describe('when create import bill', () => {

        it('create new warehouse to test', () => {
            return app
                .post('/api/warehouses')
                .set({
                    Authorization: adminToken
                })
                .send({
                    name: 'Test Warehouse for import bill',
                    description: 'Test Warehouse Description',
                    address: 'address',
                    hotline: '0123'
                })
                .expect(200)
                .expect((res) => {
                    newWarehouseId = res.body.id;
                });
        });

        it('should return OK status and json object', () => {
            return app
                .post('/api/import_bills')
                .set({
                    Authorization: adminToken
                })
                .send({
                    stockIds: [1, 2],
                    quantities: [5, 10],
                    warehouseId: newWarehouseId,
                    username: 'admin',
                    note: 'admin'
                })
                .expect(200)
                .expect((res) => {
                    newImportBillId = res.body.id;
                    expect(res.body).toMatchObject({
                        warehouse: {
                            id: newWarehouseId
                        },
                        stocks: [
                            {
                                stockId: 1,
                                quantity: 5,
                            },
                            {
                                stockId: 2,
                                quantity: 10
                            }
                        ],
                        user: {
                            username: 'admin'
                        },
                        note: 'admin'
                    });
                });
        });
    });

    describe('when get import bill info', () => {
        it('should return OK status', () => {
            return app
                .get('/api/import_bills/' + newImportBillId)
                .set({
                    Authorization: adminToken
                })
                .expect((res) => {
                    expect(res.body).toMatchObject(
                        {
                            id: newImportBillId
                        }
                    );
                });
        });
    });

    describe('when get all import bills', () => {
        describe('with normal mode', () => {
            it('should return OK status and json array', () => {
                return app
                    .get('/api/import_bills')
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

    describe('when update import bill', () => {
        it('should return OK status and json object with new info', () => {
            return app
                .put('/api/import_bills/' + newImportBillId)
                .set({
                    Authorization: adminToken
                })
                .send({
                    username: 'staff',
                    note: 'Test Update'
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body).toMatchObject(
                        {
                            id: newImportBillId,
                            user: {
                                username: 'staff'
                            },
                            note: 'Test Update'
                        }
                    );
                });
        });
    });

    describe('when delete importBill', () => {
        describe('exist importBill', () => {
            it('should return OK status', () => {
                return app
                    .delete('/api/import_bills/' + newImportBillId)
                    .set({
                        Authorization: adminToken
                    })
                    .expect(res => expect(res.status).toBe(200));
            });

            it('should minus warehouse stock quantity', () => {
                return app
                    .get('/api/warehouses/' + newWarehouseId)
                    .set({
                        Authorization: adminToken
                    })
                    .expect((res) => {
                        expect(res.body).toMatchObject(
                            {
                                warehouseStocks: [
                                    {
                                        quantity: 0
                                    },
                                    {
                                        quantity: 0
                                    }
                                ]
                            }
                        );
                    });
            });
        });

        describe('not found importBill', () => {
            it('should return 500 error code', () => {
                return app
                    .delete('/api/import_bills/0')
                    .set({
                        Authorization: adminToken
                    })
                    .expect(res => expect(res.status).toBe(500));
            });
        });
    });
});
