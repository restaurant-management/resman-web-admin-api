import { expect } from 'chai';
import { SuperTest, Test } from 'supertest';
import { Application } from '../lib/application';

describe('The User Router', () => {
    let app: SuperTest<Test>;

    before(async () => {
        try {
            app = await Application.getTestApp();
        } catch (error) {
            console.error(error);
        }
    });

    describe('when user login', () => {
        describe('with username', () => {
            it('should return OK status and a token', () => {
                return app
                    .get('/api/users/login')
                    .send({
                        usernameOrEmail: 'admin',
                        password: 'admin'
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
                    .get('/api/users/login')
                    .send({
                        usernameOrEmail: 'hienlh1298@gmail.com',
                        password: 'admin'
                    })
                    .expect(200)
                    .expect(res => {
                        expect(res.body).to.match(/.*\..*\..*/);
                    });
            });
        });
    });
});
