import bodyParser from 'body-parser';
import express from 'express';
import i18n from 'i18n';
import logger from 'morgan';
import path from 'path';
import supertest, { SuperTest, Test } from 'supertest';
import { createConnections } from 'typeorm';
import errorHandler from '../middleware/errorHandler';
import router from '../router';
import seedData from '../seeder';

export class Application {

    public static async getApp() {
        if (this._app) { return this._app; }

        this._app = express();

        this._app.use(bodyParser.json());
        this._app.use(bodyParser.urlencoded({ extended: true }));
        this._app.use(logger('dev'));

        this._setupMultiLanguage();

        try {
            await createConnections();
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

    public static async getTestApp(): Promise<SuperTest<Test>> {
        try {
            const app = await this.getApp();

            return supertest(app);
        } catch (e) {
            throw e;
        }
    }
    private static _app: express.Application;

    private static _setupMultiLanguage() {
        i18n.configure({
            directory: process.env.PWD + '/src/language',
            defaultLocale: 'en',
            fallbacks: {
                ['vi']: 'en'
            },
            cookie: 'resman_language',
        });

        this._app.use(i18n.init);

        this._app.use((req, res, next) => {
            if (req.query.lang) {
                i18n.setLocale(req.query.lang);
            }
            res.locals.locale = req.getLocale();
            next();
        });
    }
}
