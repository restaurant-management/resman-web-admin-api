import { getLocale } from 'i18n';
import jwt from 'jsonwebtoken';
import { SuperTest, Test } from 'supertest';
import { User } from '../entity/user';
import { Application } from '../lib/application';

describe('The VoucherCode Router', () => {
    let app: SuperTest<Test>;
    let adminToken: string;
    let firstCode: string;

    beforeAll(async () => {
        try {
            app = await Application.getTestApp();
            adminToken = jwt.sign({ uuid: (await User.findOne(1)).uuid },
                process.env.JWT_SECRET_KEY, { expiresIn: `1 days` });
        } catch (error) {
            console.error(error);
        }
    });

    describe('when create voucher code', () => {
        it('should return OK status and json object', (done) => {
            return app
                .post('/api/voucher_codes')
                .set({
                    Authorization: adminToken
                })
                .send({
                    name: 'Test VoucherCode',
                    startAt: new Date(1998, 1, 1),
                    endAt: new Date(2098, 1, 1),
                    value: 10,
                    storeIds: [1],
                    description: 'Test VoucherCode Description',
                    image: 'image',
                    minBillPrice: 200000,
                    maxPriceDiscount: 120000,
                    isActive: true,
                    isPercent: true
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body).toMatchObject({
                        name: 'Test VoucherCode',
                        startAt: (new Date(1998, 1, 1)).toJSON(),
                        endAt: (new Date(2098, 1, 1)).toJSON(),
                        value: 10,
                        stores: [
                            { id: 1 }
                        ],
                        description: 'Test VoucherCode Description',
                        image: 'image',
                        minBillPrice: Intl.NumberFormat(getLocale(), { style: 'currency', currency: 'USD' })
                            .format(200000),
                        maxPriceDiscount: Intl.NumberFormat(getLocale(), { style: 'currency', currency: 'USD' })
                            .format(120000),
                        isActive: true,
                        isPercent: true
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

    describe('when get one or all voucherCodes', () => {
        describe('with normal mode', () => {
            it('should return OK status and json array', () => {
                return app
                    .get('/api/voucher_codes')
                    .set({
                        Authorization: adminToken
                    })
                    .expect(200)
                    .expect((res) => {
                        expect(res.body.length)
                            .toBeGreaterThanOrEqual(0);
                        firstCode = res.body[0].code;
                    });
            });

            it('should return OK status', () => {
                return app
                    .get('/api/voucher_codes/' + firstCode)
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

    describe('when update voucherCode', () => {
        it('should return OK status and json object with new info', () => {
            return app
                .put('/api/voucher_codes/' + firstCode)
                .set({
                    Authorization: adminToken
                })
                .send({
                    name: 'Updated VoucherCode',
                    startAt: new Date(1998, 1, 1),
                    endAt: new Date(2018, 1, 1),
                    value: 10000,
                    storeIds: [1],
                    description: 'Updated test voucherCode description',
                    image: 'updated image',
                    minBillPrice: 20000,
                    maxPriceDiscount: 12000,
                    isActive: true,
                    isPercent: false
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body).toMatchObject(
                        {
                            name: 'Updated VoucherCode',
                            startAt: (new Date(1998, 1, 1)).toJSON(),
                            endAt: (new Date(2018, 1, 1)).toJSON(),
                            value: 10000,
                            stores: [
                                { id: 1 }
                            ],
                            description: 'Updated test voucherCode description',
                            image: 'updated image',
                            minBillPrice: Intl.NumberFormat(getLocale(), { style: 'currency', currency: 'USD' })
                                .format(20000),
                            maxPriceDiscount: Intl.NumberFormat(getLocale(), { style: 'currency', currency: 'USD' })
                                .format(12000),
                            isActive: true,
                            isPercent: true
                        }
                    );
                });
        });
    });

    describe('when delete voucherCode', () => {
        describe('exist voucherCode', () => {
            it('should return OK status', () => {
                return app
                    .delete('/api/voucher_codes/' + firstCode)
                    .set({
                        Authorization: adminToken
                    })
                    .expect(res => expect(res.status).toBe(200));
            });
        });

        describe('not found voucherCode', () => {
            it('should return 500 error code', () => {
                return app
                    .delete('/api/voucher_codes/3')
                    .set({
                        Authorization: adminToken
                    })
                    .expect(res => expect(res.status).toBe(500));
            });
        });
    });
});
