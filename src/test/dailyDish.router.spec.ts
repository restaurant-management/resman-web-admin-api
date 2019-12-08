import { SuperTest, Test } from 'supertest';
import { Application } from '../lib/application';
import { AuthService } from '../service/authService';
import { UserService } from '../service/user.service';

describe('The DailyDish Router', () => {
    let app: SuperTest<Test>;
    let adminToken: string;

    beforeAll(async () => {
        try {
            app = await Application.getTestApp();
            adminToken = AuthService.sign(await UserService.getOne({ username: 'admin' }));
        } catch (error) {
            console.error(error);
        }
    });

    describe('when create daily dish', () => {
        it('should return OK status and json object', (done) => {
            return app
                .post('/api/daily_dishes')
                .set({
                    Authorization: adminToken
                })
                .send({
                    day: '2019-02-01',
                    dishId: 1,
                    storeId: 1,
                    session: 'noon',
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body).toMatchObject({
                        day: '2019-02-01',
                        dishId: 1,
                        session: 'noon',
                        storeId: 1
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

    describe('when get daily dish info', () => {
        it('should return OK status', (done) => {
            return app
                .get('/api/daily_dishes/get?day=2019-02-01&dishId=1&session=noon&storeId=1')
                .set({
                    Authorization: adminToken
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body).toMatchObject(
                        {
                            dishId: 1
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

    describe('when get all daily dishes by admin', () => {
        describe('with normal mode', () => {
            it('should return OK status and json array', () => {
                return app
                    .get('/api/daily_dishes')
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

    describe('when get today daily dishes for anyone', () => {
        it('should return OK status and json array', () => {
            return app
                .get('/api/daily_dishes/today?storeId=1')
                .expect(200)
                .expect((res) => {
                    expect(res.body.length)
                        .toBeGreaterThanOrEqual(0);
                });
        });
    });

    describe('when update daily dish', () => {
        it('should return OK status and json object with new info', (done) => {
            const date = new Date();

            return app
                .put('/api/daily_dishes?day=2019-02-01&dishId=1&session=noon')
                .set({
                    Authorization: adminToken
                })
                .send({
                    confirmByUsername: 'admin',
                    confirmAt: date
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body).toMatchObject(
                        {
                            day: '2019-02-01',
                            dishId: 1,
                            session: 'noon',
                            storeId: 1,
                            confirmAt: date.toJSON(),
                            confirmBy: {
                                username: 'admin'
                            }
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

    describe('when delete daily dish', () => {
        describe('exist dailyDish', () => {
            it('should return OK status', () => {
                return app
                    .delete('/api/daily_dishes?day=2019-02-01&dishId=1&session=noon')
                    .set({
                        Authorization: adminToken
                    })
                    .expect(res => expect(res.status).toBe(200));
            });
        });

        describe('not found daily dish', () => {
            it('should return 500 error code', () => {
                return app
                    .delete('/api/daily_dishes?day=2019-02-01&dishId=1&session=noon')
                    .set({
                        Authorization: adminToken
                    })
                    .expect(res => expect(res.status).toBe(500));
            });
        });
    });
});
