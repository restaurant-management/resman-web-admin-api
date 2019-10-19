import bodyParser from 'body-parser';
import express from 'express';
import i18next, { TFunction } from 'i18next';
import i18nextMiddleware from 'i18next-express-middleware';
import Backend from 'i18next-node-fs-backend';
import logger from 'morgan';
import path from 'path';
import supertest, { SuperTest, Test } from 'supertest';
import { createConnection, getConnectionOptions } from 'typeorm';
import errorHandler from '../middleware/errorHandler';
import router from '../router';
import seedData from '../seeder';

export class Application {

    public static async getApp() {
        console.info(`Running Mode: ${process.env.NODE_ENV}`);

        if (this._app) { return this._app; }

        this._app = express();

        this._app.use(bodyParser.json());
        this._app.use(bodyParser.urlencoded({ extended: true }));
        this._app.use(logger('dev'));

        try {
            await i18next
                .use(Backend)
                .use(i18nextMiddleware.LanguageDetector)
                .init({
                    backend: {
                        loadPath: process.env.PWD + '/src/language/{{lng}}/{{ns}}.json',
                        addPath: process.env.PWD + '/src/language/{{lng}}/{{ns}}.missing.json'
                    },
                    fallbackLng: 'en',
                    preload: ['en', 'vi'],
                    saveMissing: true,
                    debug: true
                });
        } catch (error) {
            console.error(error);
        }

        this._app.use(i18nextMiddleware.handle(i18next));

        try {
            await this.createTypeOrmConnection();

            await seedData();

            this._app.use('/api', router);
            this._app.use(errorHandler);

            if (process.env.NODE_ENV === 'production') {
                this._app.use(express.static('client/build'));

                this._app.get('/*', (_req, res) => {
                    res.sendFile(path.join(process.env.PWD, 'client/build', 'index.html'));
                });
            }

            return this._app;
        } catch (error) {
            console.error(error);
        }
    }

    public static async createTypeOrmConnection() {
        const options = await getConnectionOptions(process.env.NODE_ENV);

        return createConnection({ ...options, name: 'default' });
    }

    public static async getTestApp(): Promise<SuperTest<Test>> {
        try {
            const app = await this.getApp();

            return supertest(app);
        } catch (e) {
            throw e;
        }
    }

    private static _app: express.Application;
}
