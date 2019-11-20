import jwt from 'jsonwebtoken';
import { SuperTest, Test } from 'supertest';
import { Permission } from '../entity/permission';
import { User } from '../entity/user';
import { Application } from '../lib/application';

describe('The Role Router', () => {
    let app: SuperTest<Test>;
    let adminToken: string;
    let newRoleSlug: string;

    beforeAll(async () => {
        try {
            app = await Application.getTestApp();
            adminToken = jwt.sign({ uuid: (await User.findOne(1)).uuid },
                process.env.JWT_SECRET_KEY, { expiresIn: `1 days` });
        } catch (error) {
            console.error(error);
        }
    });

    describe('when create role', () => {
        describe('without slug', () => {
            it('should return OK status and json object', (done) => {
                return app
                    .post('/api/roles')
                    .set({
                        Authorization: adminToken
                    })
                    .send({
                        name: 'Test Role',
                        description: 'Test Role Description',
                        level: 1,
                        permissions: Permission.analysis.toArray()
                    })
                    .expect(200)
                    .expect((res) => {
                        expect(res.body).toMatchObject({
                            name: 'Test Role',
                            description: 'Test Role Description',
                            level: 1,
                            permissions: Permission.analysis.toArray(),
                            slug: 'test-role'
                        });
                        newRoleSlug = res.body.slug;
                    })
                    .end((err, res) => {
                        console.log(res.body);
                        done(err);
                    });
            });
        });
        describe('with slug', () => {
            it('should return OK status and json object', () => {
                return app
                    .post('/api/roles')
                    .set({
                        Authorization: adminToken
                    })
                    .send({
                        name: 'Test Role',
                        slug: 'role-test'
                    })
                    .expect(200)
                    .expect((res) => {
                        expect(res.body).toMatchObject({
                            name: 'Test Role',
                            slug: 'role-test'
                        });
                    });
            });
        });
    });

    describe('when get role info', () => {
        it('should return OK status', () => {
            return app
                .get('/api/roles/' + newRoleSlug)
                .set({
                    Authorization: adminToken
                })
                .expect((res) => {
                    expect(res.body).toMatchObject(
                        {
                            slug: newRoleSlug
                        }
                    );
                });
        });
    });

    describe('when get all roles', () => {
        describe('with normal mode', () => {
            it('should return OK status and json array', () => {
                return app
                    .get('/api/roles')
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

    describe('when update role', () => {
        it('should return OK status and json object with new info', () => {
            return app
                .put('/api/roles/' + newRoleSlug)
                .set({
                    Authorization: adminToken
                })
                .send({
                    name: 'update name',
                    description: 'update description',
                    level: 5,
                    permissions: [...Permission.bill.toArray(), ...Permission.role.toArray()]
                })
                .expect(200)
                .expect((res) => {
                    newRoleSlug = res.body.slug;
                    expect(res.body).toMatchObject({
                        name: 'update name',
                        slug: newRoleSlug,
                        description: 'update description',
                        level: 5,
                        permissions: [...Permission.bill.toArray(), ...Permission.role.toArray()]
                    });
                });
        });
    });

    describe('when delete role', () => {
        describe('exist role', () => {
            it('should return OK status', () => {
                return app
                    .delete('/api/roles/' + newRoleSlug)
                    .set({
                        Authorization: adminToken
                    })
                    .expect(res => expect(res.status).toBe(200));
            });
        });

        describe('not found role', () => {
            it('should return 500 error code', () => {
                return app
                    .delete('/api/roles/0')
                    .set({
                        Authorization: adminToken
                    })
                    .expect(res => expect(res.status).toBe(500));
            });
        });
    });
});
