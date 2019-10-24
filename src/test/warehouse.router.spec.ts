import jwt from 'jsonwebtoken';
import { SuperTest, Test } from 'supertest';
import { User } from '../entity/user';
import { Application } from '../lib/application';

describe('The Warehouse Router', () => {
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

    describe('when create warehouse', () => {
        it('should return OK status and json object', () => {
            return app
                .post('/api/warehouses/create')
                .set({
                    Authorization: adminToken
                })
                .send({
                    name: 'Test Warehouse',
                    description: 'Test Warehouse Description',
                    address: 'address',
                    hotline: '0123'
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body).toMatchObject({
                        name: 'Test Warehouse',
                        description: 'Test Warehouse Description',
                        address: 'address',
                        hotline: '0123'
                    });
                });
        });
    });

    describe('when get warehouse info', () => {
        it('should return OK status', () => {
            return app
                .get('/api/warehouses/1')
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

    describe('when get all warehouses', () => {
        describe('with normal mode', () => {
            it('should return OK status and json array', () => {
                return app
                    .get('/api/warehouses')
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

    describe('when update warehouse', () => {
        it('should return OK status and json object with new info', () => {
            return app
                .put('/api/warehouses/1/update')
                .set({
                    Authorization: adminToken
                })
                .send({
                    name: 'update name',
                    address: 'update address',
                    hotline: '09876',
                    description: 'update description'
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body).toMatchObject(
                        {
                            id: 1,
                            name: 'update name',
                            address: 'update address',
                            hotline: '09876',
                            description: 'update description'
                        }
                    );
                });
        });
    });

    describe('when delete warehouse', () => {
        describe('exist warehouse', () => {
            it('should return OK status', () => {
                return app
                    .delete('/api/warehouses/1/delete')
                    .set({
                        Authorization: adminToken
                    })
                    .expect(res => expect(res.status).toBe(200));
            });
        });

        describe('not found warehouse', () => {
            it('should return 500 error code', () => {
                return app
                    .delete('/api/warehouses/3/delete')
                    .set({
                        Authorization: adminToken
                    })
                    .expect(res => expect(res.status).toBe(500));
            });
        });
    });
});
