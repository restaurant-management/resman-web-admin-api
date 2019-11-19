import jwt from 'jsonwebtoken';
import { SuperTest, Test } from 'supertest';
import { User } from '../entity/user';
import { Application } from '../lib/application';

describe('The DailyReport Router', () => {
    let app: SuperTest<Test>;
    let adminToken: string;
    let newWarehouseId: number = 0;
    let newDRId: number = 0;

    beforeAll(async () => {
        try {
            app = await Application.getTestApp();
            adminToken = jwt.sign({ uuid: (await User.findOne(1)).uuid },
                process.env.JWT_SECRET_KEY, { expiresIn: `1 days` });
        } catch (error) {
            console.error(error);
        }
    });

    describe('when create daily report', () => {

        it('create new warehouse to test', () => {
            return app
                .post('/api/warehouses')
                .set({
                    Authorization: adminToken
                })
                .send({
                    name: 'Test Warehouse for daily report',
                    description: 'Test Warehouse Description 12',
                    address: 'address 12',
                    hotline: '01234'
                })
                .expect(200)
                .expect((res) => {
                    newWarehouseId = res.body.id;
                });
        });

        it('create import bill before', () => {
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
                .expect(200);
        });

        it('should return OK status and json object', (done) => {
            return app
                .post('/api/daily_reports')
                .set({
                    Authorization: adminToken
                })
                .send({
                    stockIds: [1, 2],
                    quantities: [5, 10],
                    warehouseId: newWarehouseId,
                    username: 'admin',
                    note: 'admin',
                    stockNotes: ['note1', 'note2'],
                })
                .expect(200)
                .expect((res) => {
                    newDRId = res.body.id;
                    expect(res.body).toMatchObject({
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
                })
                .end((err, res) => {
                    console.log(res.body);
                    console.log(newDRId);
                    done(err);
                });
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

    describe('when get daily report info', () => {
        it('should return OK status', () => {
            return app
                .get('/api/daily_reports/' + newDRId)
                .set({
                    Authorization: adminToken
                })
                .expect((res) => {
                    expect(res.body).toMatchObject(
                        {
                            id: newDRId
                        }
                    );
                });
        });
    });

    describe('when get all daily reports', () => {
        describe('with normal mode', () => {
            it('should return OK status and json array', () => {
                return app
                    .get('/api/daily_reports')
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

    describe('when update daily report', () => {
        it('should return OK status and json object with new info', () => {
            return app
                .put('/api/daily_reports/' + newDRId)
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
                            id: newDRId,
                            user: {
                                username: 'staff'
                            },
                            note: 'Test Update'
                        }
                    );
                });
        });
    });

    describe('when delete dailyReport', () => {
        describe('exist dailyReport', () => {
            it('should return OK status', () => {
                return app
                    .delete('/api/daily_reports/' + newDRId)
                    .set({
                        Authorization: adminToken
                    })
                    .expect(res => expect(res.status).toBe(200));
            });

            it('should minus warehouse stock quantity', () => {
                return app
                    .get('/api/warehouses/' + newDRId)
                    .set({
                        Authorization: adminToken
                    })
                    .expect((res) => {
                        expect(res.body).toMatchObject(
                            {
                                warehouseStocks: [
                                    {
                                        quantity: 5
                                    },
                                    {
                                        quantity: 10
                                    }
                                ]
                            }
                        );
                    });
            });
        });

        describe('not found dailyReport', () => {
            it('should return 500 error code', () => {
                return app
                    .delete('/api/daily_reports/0')
                    .set({
                        Authorization: adminToken
                    })
                    .expect(res => expect(res.status).toBe(500));
            });
        });
    });
});
