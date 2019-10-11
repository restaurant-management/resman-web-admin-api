import { SuperTest, Test } from 'supertest';
import { Application } from '../lib/application';

describe('The User Router', () => {
    let app: SuperTest<Test>;

    beforeAll(async () => {
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
                        password: 'admin',
                        usernameOrEmail: 'admin',
                    })
                    .expect(200)
                    .expect((res) => {
                        expect(res.body).toEqual(expect.stringMatching(/.*\..*\..*/));
                    });
            });
        });
        describe('with email', () => {
            it('should return OK status and a token', () => {
                return app
                    .get('/api/users/login')
                    .send({
                        password: 'admin',
                        usernameOrEmail: 'hienlh1298@gmail.com'
                    })
                    .expect(200)
                    .expect((res) => {
                        expect(res.body).toEqual(expect.stringMatching(/.*\..*\..*/));
                    });
            });
        });
    });
});
