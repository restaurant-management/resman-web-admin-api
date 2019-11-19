import jwt from 'jsonwebtoken';
import { SuperTest, Test } from 'supertest';
import { User } from '../entity/user';
import { Application } from '../lib/application';

describe('The Store Router', () => {
    let app: SuperTest<Test>;
    let adminToken: string;
    let newStoreId: 2;

    beforeAll(async () => {
        try {
            app = await Application.getTestApp();
            adminToken = jwt.sign({ uuid: (await User.findOne(1)).uuid },
                process.env.JWT_SECRET_KEY, { expiresIn: `1 days` });
        } catch (error) {
            console.error(error);
        }
    });

    describe('when create store', () => {
        it('should return OK status and json object', () => {
            return app
                .post('/api/stores')
                .set({
                    Authorization: adminToken
                })
                .send({
                    name: 'Test Store',
                    description: 'Test Store Description',
                    logo: 'logo',
                    address: 'address',
                    hotline: '0123'
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body).toMatchObject({
                        name: 'Test Store',
                        description: 'Test Store Description',
                        logo: 'logo',
                        address: 'address',
                        hotline: '0123'
                    });
                    newStoreId = res.body.id;
                });
        });
    });

    describe('when get store info', () => {
        it('should return OK status', () => {
            return app
                .get('/api/stores/' + newStoreId)
                .set({
                    Authorization: adminToken
                })
                .expect((res) => {
                    expect(res.body).toMatchObject(
                        {
                            id: newStoreId
                        }
                    );
                });
        });
    });

    describe('when get all stores', () => {
        describe('with normal mode', () => {
            it('should return OK status and json array', () => {
                return app
                    .get('/api/stores')
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

    describe('when update store', () => {
        it('should return OK status and json object with new info', () => {
            return app
                .put('/api/stores/' + newStoreId)
                .set({
                    Authorization: adminToken
                })
                .send({
                    name: 'update name',
                    address: 'update address',
                    hotline: '09876',
                    description: 'update description',
                    logo: 'update logo'
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body).toMatchObject(
                        {
                            id: newStoreId,
                            name: 'update name',
                            address: 'update address',
                            hotline: '09876',
                            description: 'update description',
                            logo: 'update logo'
                        }
                    );
                });
        });
    });

    describe('when delete store', () => {
        describe('exist store', () => {
            it('should return OK status', () => {
                return app
                    .delete('/api/stores/' + newStoreId)
                    .set({
                        Authorization: adminToken
                    })
                    .expect(res => expect(res.status).toBe(200));
            });
        });

        describe('not found store', () => {
            it('should return 500 error code', () => {
                return app
                    .delete('/api/stores/0')
                    .set({
                        Authorization: adminToken
                    })
                    .expect(res => expect(res.status).toBe(500));
            });
        });
    });
});
