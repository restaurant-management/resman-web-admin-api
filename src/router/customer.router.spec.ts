import { expect } from 'chai';
import { SuperTest, Test } from 'supertest';
import { Application } from '../lib/application';

describe('The Customer Router', () => {
    let app: SuperTest<Test>;

    before(async () => {
        try {
            app = await Application.getTestApp();
        } catch (error) {
            console.error(error);
        }
    });

    describe('when customer login', () => {
        describe('with username', () => {
            it('should return OK status and a token', () => {
                return app
                    .get('/api/customers/login')
                    .send({
                        usernameOrEmail: 'customer',
                        password: 'customer'
                    })
                    .expect(200)
                    .expect(res => {
                        expect(res.body).to.match(/.*\..*\..*/);
                    });
            });
        });
        describe('with email', () => {
            it('should return OK status and a token', () => {
                return app
                    .get('/api/customers/login')
                    .send({
                        usernameOrEmail: '16520361@gm.uit.edu.vn',
                        password: 'customer'
                    })
                    .expect(200)
                    .expect(res => {
                        expect(res.body).to.match(/.*\..*\..*/);
                    });
            });
        });
    });
});
