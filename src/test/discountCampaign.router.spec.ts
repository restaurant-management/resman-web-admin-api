import jwt from 'jsonwebtoken';
import { SuperTest, Test } from 'supertest';
import { User } from '../entity/user';
import { Application } from '../lib/application';

describe('The DiscountCampaign Router', () => {
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

    describe('when create Discount Campaign', () => {
        it('should return OK status and json object', (done) => {
            return app
                .post('/api/discount_campaigns')
                .set({
                    Authorization: adminToken
                })
                .send({
                    name: 'Test DiscountCampaign',
                    description: 'Test DiscountCampaign Description',
                    banner: 'Image link',
                    startAt: new Date(1998, 1, 1),
                    endAt: new Date(2098, 1, 1),
                    defaultDiscount: 10,
                    storeIds: [1],
                    dishIds: [1],
                    discounts: [0]
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body).toMatchObject({
                        name: 'Test DiscountCampaign',
                        description: 'Test DiscountCampaign Description',
                        banner: 'Image link',
                        startAt: (new Date(1998, 1, 1)).toJSON(),
                        endAt: (new Date(2098, 1, 1)).toJSON(),
                        defaultDiscount: 10,
                        stores: [
                            { id: 1 }
                        ],
                        dishes: [
                            {
                                dishId: 1,
                                discount: 0
                            }
                        ]
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

    describe('when get one or all discountCampaigns', () => {
        describe('with normal mode', () => {
            it('should return OK status and json array', () => {
                return app
                    .get('/api/discount_campaigns')
                    .set({
                        Authorization: adminToken
                    })
                    .expect(200)
                    .expect((res) => {
                        expect(res.body.length)
                            .toBeGreaterThanOrEqual(0);
                    });
            });

            it('should return OK status', () => {
                return app
                    .get('/api/discount_campaigns/1')
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
    });

    describe('when update discountCampaign', () => {
        it('should return OK status and json object with new info', (done) => {
            return app
                .put('/api/discount_campaigns/1')
                .set({
                    Authorization: adminToken
                })
                .send({
                    name: 'Updated DiscountCampaign',
                    description: 'Updated DiscountCampaign Description',
                    banner: 'Updated Image link',
                    startAt: new Date(1998, 1, 1),
                    endAt: new Date(2018, 1, 1),
                    defaultDiscount: 20,
                    storeIds: [1],
                    dishIds: [2],
                    discounts: [30]
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body).toMatchObject(
                        {
                            name: 'Updated DiscountCampaign',
                            description: 'Updated DiscountCampaign Description',
                            banner: 'Updated Image link',
                            startAt: (new Date(1998, 1, 1)).toJSON(),
                            endAt: (new Date(2018, 1, 1)).toJSON(),
                            defaultDiscount: 20,
                            stores: [
                                { id: 1 }
                            ],
                            dishes: [
                                {
                                    dishId: 2,
                                    discount: 30
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

    describe('when delete discountCampaign', () => {
        describe('exist discountCampaign', () => {
            it('should return OK status', (done) => {
                return app
                    .delete('/api/discount_campaigns/1')
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
        });

        describe('not found discountCampaign', () => {
            it('should return 500 error code', () => {
                return app
                    .delete('/api/discount_campaigns/0')
                    .set({
                        Authorization: adminToken
                    })
                    .expect(res => expect(res.status).toBe(500));
            });
        });
    });
});
