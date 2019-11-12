import jwt from 'jsonwebtoken';
import { SuperTest, Test } from 'supertest';
import { User } from '../entity/user';
import { Application } from '../lib/application';
import { CustomerService } from '../service/customer.service';

describe('The Address Router', () => {
    let app: SuperTest<Test>;
    let customerUuid: string;
    let adminToken: string;

    beforeAll(async () => {
        try {
            app = await Application.getTestApp();
            adminToken = jwt.sign({ uuid: (await User.findOne(1)).uuid },
                process.env.JWT_SECRET_KEY, { expiresIn: `1 days` });
            customerUuid = (await CustomerService.getOne({ id: 1 })).uuid;
        } catch (error) {
            console.error(error);
        }
    });

    describe('when create address', () => {
        it('should return OK status and json object', () => {
            return app
                .post('/api/addresses')
                .set({
                    Authorization: adminToken
                })
                .send({
                    address: 'address',
                    longitude: 10.342,
                    latitude: 10.222,
                    customerUuid
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body).toMatchObject({
                        address: 'address',
                        longitude: 10.342,
                        latitude: 10.222,
                        customer: {
                            id: 1,
                            uuid: customerUuid
                        }
                    });
                });
        });
    });

    describe('when get address info', () => {
        it('should return OK status', () => {
            return app
                .get('/api/addresses/1')
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

    describe('when get all addresses', () => {
        describe('with normal mode', () => {
            it('should return OK status and json array', () => {
                return app
                    .get('/api/addresses')
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

    describe('when update address', () => {
        it('should return OK status and json object with new info', () => {
            return app
                .put('/api/addresses/1')
                .set({
                    Authorization: adminToken
                })
                .send({
                    address: 'updated address',
                    longitude: 1.342,
                    latitude: 1.222,
                    customerUuid
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body).toMatchObject(
                        {
                            address: 'updated address',
                            longitude: 1.342,
                            latitude: 1.222,
                            customer: {
                                id: 1,
                                uuid: customerUuid
                            }
                        }
                    );
                });
        });
    });

    describe('when delete address', () => {
        // describe('exist address', () => {
        //     it('should return OK status', () => {
        //         return app
        //             .delete('/api/addresses/1')
        //             .set({
        //                 Authorization: adminToken
        //             })
        //             .expect(res => expect(res.status).toBe(200));
        //     });
        // });

        describe('not found address', () => {
            it('should return 500 error code', () => {
                return app
                    .delete('/api/addresses/3')
                    .set({
                        Authorization: adminToken
                    })
                    .expect(res => expect(res.status).toBe(500));
            });
        });
    });
});
