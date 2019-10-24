import jwt from 'jsonwebtoken';
import { SuperTest, Test } from 'supertest';
import { User } from '../entity/user';
import { Application } from '../lib/application';

describe('The Store Router', () => {
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

    describe('when create store', () => {
        it('should return OK status and json object', () => {
            return app
                .post('/api/stores/create')
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
                        hotline: '0123',
                        id: 1
                    });
                });
        });
    });

    describe('when get store info', () => {
        it('should return OK status', () => {
            return app
                .get('/api/stores/1')
                .set({
                    Authorization: adminToken
                })
                .expect((res) => {
                    expect(res.body).toMatchObject(
                        {
                            name: 'Test Store',
                            description: 'Test Store Description',
                            logo: 'logo',
                            address: 'address',
                            hotline: '0123',
                            id: 1
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
                        expect(res.body).toMatchObject([
                            {
                                id: 1
                            }
                        ]);
                    });
            });
        });
    });

    describe('when update store', () => {
        it('should return OK status and json object with new info', () => {
            return app
                .put('/api/stores/1/update')
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
                            id: 1,
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
                    .delete('/api/stores/1/delete')
                    .set({
                        Authorization: adminToken
                    })
                    .expect(res => expect(res.status).toBe(200));
            });
        });

        describe('not found store', () => {
            it('should return 500 error code', () => {
                return app
                    .delete('/api/stores/3/delete')
                    .set({
                        Authorization: adminToken
                    })
                    .expect(res => expect(res.status).toBe(500));
            });
        });
    });
});
