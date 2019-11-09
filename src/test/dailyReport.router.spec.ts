import jwt from 'jsonwebtoken';
import { SuperTest, Test } from 'supertest';
import { User } from '../entity/user';
import { Application } from '../lib/application';

describe('The DailyReport Router', () => {
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

    describe('when create daily report', () => {
        it('should return OK status and json object', (done) => {
            return app
                .post('/api/daily_reports')
                .set({
                    Authorization: adminToken
                })
                .send({
                    stockIds: [1, 2],
                    quantities: [5, 10],
                    warehouseId: 1,
                    username: 'admin',
                    note: 'admin',
                    stockNotes: ['note1', 'note2'],
                })
                .expect(200)
                .expect((res) => {
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
                    if (err) {
                        console.log(res.body);
                    }
                    done(err);
                });
        });
    });

    describe('when get daily report info', () => {
        it('should return OK status', () => {
            return app
                .get('/api/daily_reports/1')
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
                .put('/api/daily_reports/1')
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
                            id: 1,
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
            it('should return OK status', (done) => {
                return app
                    .delete('/api/daily_reports/1')
                    .set({
                        Authorization: adminToken
                    })
                    .expect(res => expect(res.status).toBe(200))
                    .end((err, res) => {
                        if (err) {
                            console.log(res.body);
                        }
                        done(err);
                    });
            });

            it('should minus warehouse stock quantity', (done) => {
                return app
                    .get('/api/warehouses/1')
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
                    })
                    .end((err, res) => {
                        if (err) {
                            console.log(res.body);
                        }
                        done(err);
                    });
            });
        });

        describe('not found dailyReport', () => {
            it('should return 500 error code', (done) => {
                return app
                    .delete('/api/daily_reports/0')
                    .set({
                        Authorization: adminToken
                    })
                    .expect(res => expect(res.status).toBe(500))
                    .end((err, res) => {
                        if (err) {
                            console.log(res.body);
                        }
                        done(err);
                    });
            });
        });
    });
});
