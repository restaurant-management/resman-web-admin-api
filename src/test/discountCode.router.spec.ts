import { getLocale } from 'i18n';
import jwt from 'jsonwebtoken';
import { SuperTest, Test } from 'supertest';
import { User } from '../entity/user';
import { Application } from '../lib/application';

describe('The DiscountCode Router', () => {
    let app: SuperTest<Test>;
    let adminToken: string;
    const firstCode: string = 'HIEREN_LEE';

    beforeAll(async () => {
        try {
            app = await Application.getTestApp();
            adminToken = jwt.sign({ uuid: (await User.findOne(1)).uuid },
                process.env.JWT_SECRET_KEY, { expiresIn: `1 days` });
        } catch (error) {
            console.error(error);
        }
    });

    describe('when create discount code', () => {
        it('should return OK status and json object', (done) => {
            return app
                .post('/api/discount_codes')
                .set({
                    Authorization: adminToken
                })
                .send({
                    code: firstCode,
                    name: 'Test DiscountCode',
                    startAt: new Date(1998, 1, 1),
                    endAt: new Date(2098, 1, 1),
                    discount: 10,
                    storeIds: [1],
                    description: 'Test DiscountCode Description',
                    minBillPrice: 200000,
                    maxPriceDiscount: 120000,
                    maxNumber: 20,
                    isActive: true
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body).toMatchObject({
                        name: 'Test DiscountCode',
                        startAt: (new Date(1998, 1, 1)).toJSON(),
                        endAt: (new Date(2098, 1, 1)).toJSON(),
                        discount: 10,
                        stores: [
                            { id: 1 }
                        ],
                        description: 'Test DiscountCode Description',
                        minBillPrice: Intl.NumberFormat(getLocale(), { style: 'currency', currency: 'USD' })
                            .format(200000),
                        maxPriceDiscount: Intl.NumberFormat(getLocale(), { style: 'currency', currency: 'USD' })
                            .format(120000),
                        maxNumber: 20,
                        isActive: true
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

    describe('when get one or all discountCodes', () => {
        describe('with normal mode', () => {
            it('should return OK status and json array', () => {
                return app
                    .get('/api/discount_codes')
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
                    .get('/api/discount_codes/' + firstCode)
                    .set({
                        Authorization: adminToken
                    })
                    .expect((res) => {
                        expect(res.body).toMatchObject(
                            {
                                code: firstCode
                            }
                        );
                    });
            });
        });
    });

    describe('when update discountCode', () => {
        it('should return OK status and json object with new info', () => {
            return app
                .put('/api/discount_codes/' + firstCode)
                .set({
                    Authorization: adminToken
                })
                .send({
                    name: 'Updated DiscountCode',
                    startAt: new Date(1998, 1, 1),
                    endAt: new Date(2018, 1, 1),
                    discount: 10,
                    storeIds: [1],
                    description: 'Updated test discountCode description',
                    minBillPrice: 20000,
                    maxPriceDiscount: 12000,
                    maxNumber: 500,
                    isActive: true
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body).toMatchObject(
                        {
                            name: 'Updated DiscountCode',
                            startAt: (new Date(1998, 1, 1)).toJSON(),
                            endAt: (new Date(2018, 1, 1)).toJSON(),
                            discount: 10,
                            stores: [
                                { id: 1 }
                            ],
                            maxNumber: 500,
                            description: 'Updated test discountCode description',
                            minBillPrice: Intl.NumberFormat(getLocale(), { style: 'currency', currency: 'USD' })
                                .format(20000),
                            maxPriceDiscount: Intl.NumberFormat(getLocale(), { style: 'currency', currency: 'USD' })
                                .format(12000),
                            isActive: true
                        }
                    );
                });
        });
    });

    describe('when delete discountCode', () => {
        describe('exist discountCode', () => {
            it('should return OK status', () => {
                return app
                    .delete('/api/discount_codes/' + firstCode)
                    .set({
                        Authorization: adminToken
                    })
                    .expect(res => expect(res.status).toBe(200));
            });
        });

        describe('not found discountCode', () => {
            it('should return 500 error code', () => {
                return app
                    .delete('/api/discount_codes/3')
                    .set({
                        Authorization: adminToken
                    })
                    .expect(res => expect(res.status).toBe(500));
            });
        });
    });
});
