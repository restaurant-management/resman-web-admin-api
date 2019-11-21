import jwt from 'jsonwebtoken';
import { SuperTest, Test } from 'supertest';
import { User } from '../entity/user';
import { Application } from '../lib/application';

describe('The Stock Router', () => {
    let app: SuperTest<Test>;
    let adminToken: string;
    let newId: number;

    beforeAll(async () => {
        try {
            app = await Application.getTestApp();
            adminToken = jwt.sign({ uuid: (await User.findOne(1)).uuid },
                process.env.JWT_SECRET_KEY, { expiresIn: `1 days` });
        } catch (error) {
            console.error(error);
        }
    });

    describe('when create stock', () => {
        it('should return OK status and json object', () => {
            return app
                .post('/api/stocks')
                .set({
                    Authorization: adminToken
                })
                .send({
                    name: 'Test Stock',
                    price: 20000,
                    unit: 'Box',
                    image: 'Image'
                })
                .expect(200)
                .expect((res) => {
                    newId = res.body.id;
                    expect(res.body).toMatchObject({
                        name: 'Test Stock',
                        price: 20000,
                        unit: 'Box',
                        image: 'Image'
                    });
                });
        });
    });

    describe('when get stock info', () => {
        it('should return OK status', () => {
            return app
                .get('/api/stocks/' + newId)
                .set({
                    Authorization: adminToken
                })
                .expect((res) => {
                    expect(res.body).toMatchObject(
                        {
                            id: newId
                        }
                    );
                });
        });
    });

    describe('when get all stocks', () => {
        describe('with normal mode', () => {
            it('should return OK status and json array', () => {
                return app
                    .get('/api/stocks')
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

    describe('when update stock', () => {
        it('should return OK status and json object with new info', () => {
            return app
                .put('/api/stocks/' + newId)
                .set({
                    Authorization: adminToken
                })
                .send({
                    name: 'Test Update Stock',
                    price: 30000,
                    unit: 'Can',
                    image: 'Updated image'
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body).toMatchObject(
                        {
                            id: newId,
                            name: 'Test Update Stock',
                            price: 30000,
                            unit: 'Can',
                            image: 'Updated image'
                        }
                    );
                });
        });
    });

    describe('when delete stock', () => {
        describe('exist stock', () => {
            it('should return OK status', () => {
                return app
                    .delete('/api/stocks/' + newId)
                    .set({
                        Authorization: adminToken
                    })
                    .expect(res => expect(res.status).toBe(200));
            });
        });

        describe('not found stock', () => {
            it('should return 500 error code', () => {
                return app
                    .delete('/api/stocks/0')
                    .set({
                        Authorization: adminToken
                    })
                    .expect(res => expect(res.status).toBe(500));
            });
        });
    });
});
