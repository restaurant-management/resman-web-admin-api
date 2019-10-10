import bodyParser from 'body-parser';
import express from 'express';
import logger from 'morgan';
import path from 'path';
import { createConnections } from 'typeorm';
import errorHandler from '../middleware/errorHandler';
import router from '../router';
import seedData from '../seeder';
import supertest, { SuperTest, Test } from 'supertest';

export class Application {
    private static _app: express.Application;

    public static getApp = async () => {
        if (Application._app) return Application._app;

        Application._app = express();

        Application._app.use(bodyParser.json());
        Application._app.use(bodyParser.urlencoded({ extended: true }));
        Application._app.use(logger('dev'));

        try {
            await createConnections();
            await seedData();
            Application._app.use('/api', router);
            Application._app.use(errorHandler);

            if (process.env.NODE_ENV === 'production') {
                Application._app.use(express.static('client/build'));

                Application._app.get('*', (_req, res) => {
                    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
                });
            }

            return Application._app;
        } catch (error) {
            error => console.error(error);
        }
    };

    public static getTestApp = (): Promise<SuperTest<Test>> => {
        return Application.getApp()
            .then(app => supertest(app))
            .catch(e => {
                throw e;
            });
    };
}
