import jwt from 'jsonwebtoken';
import { SuperTest, Test } from 'supertest';
import { User } from '../entity/user';
import { Application } from '../lib/application';

describe('The Dish Router', () => {
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

    describe('when create dish', () => {
        it('should return OK status and json object', (done) => {
            return app
                .post('/api/dishes')
                .set({
                    Authorization: adminToken
                })
                .send({
                    name: 'Test Dish',
                    description: 'Test Dish Description',
                    images: ['a', 'b'],
                    defaultPrice: 10
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body).toMatchObject({
                        name: 'Test Dish',
                        description: 'Test Dish Description',
                        images: ['a', 'b']
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

    describe('when get dish info', () => {
        it('should return OK status', (done) => {
            return app
                .get('/api/dishes/1')
                .set({
                    Authorization: adminToken
                })
                .expect((res) => {
                    expect(res.body).toMatchObject(
                        {
                            id: 1
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

    describe('when get all dishes', () => {
        describe('with normal mode', () => {
            it('should return OK status and json array', () => {
                return app
                    .get('/api/dishes')
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

    describe('when update dish', () => {
        it('should return OK status and json object with new info', () => {
            return app
                .put('/api/dishes/1')
                .set({
                    Authorization: adminToken
                })
                .send({
                    name: 'update name',
                    description: 'update description',
                    images: ['c', 'd'],
                    defaultPrice: 100
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body).toMatchObject(
                        {
                            name: 'update name',
                            description: 'update description',
                            images: ['c', 'd'],
                            defaultPrice: 100
                        }
                    );
                });
        });
    });

    describe('when delete dish', () => {
        describe('exist dish', () => {
            it('should return OK status', () => {
                return app
                    .delete('/api/dishes/1')
                    .set({
                        Authorization: adminToken
                    })
                    .expect(res => expect(res.status).toBe(200));
            });
        });

        describe('not found dish', () => {
            it('should return 500 error code', () => {
                return app
                    .delete('/api/dishes/0')
                    .set({
                        Authorization: adminToken
                    })
                    .expect(res => expect(res.status).toBe(500));
            });
        });
    });
});
