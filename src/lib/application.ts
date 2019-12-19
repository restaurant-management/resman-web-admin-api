import { ApolloServer } from 'apollo-server-express';
import bodyParser from 'body-parser';
import express from 'express';
import i18n from 'i18n';
import logger from 'morgan';
import path from 'path';
import supertest, { SuperTest, Test } from 'supertest';
import { buildSchema } from 'type-graphql';
import { createConnection, getConnectionOptions } from 'typeorm';
import { Customer } from '../entity/customer';
import { User } from '../entity/user';
import { AuthorGraphMiddleware } from '../middleware/authorization';
import errorHandler, { graphErrorHandler } from '../middleware/errorHandler';
import { resolvers } from '../resolver';
import router from '../router';
import seedData from '../seeder';
import { AuthService } from '../service/authService';

export class Application {

    public static async getApp() {
        console.info(`Running Mode: ${process.env.NODE_ENV}`);

        if (this._app) { return this._app; }

        this._app = express();

        this._app.use(bodyParser.json());
        this._app.use(bodyParser.urlencoded({ extended: true }));
        this._app.use(logger('dev'));

        this._setupMultiLanguage();

        try {
            await this.createTypeOrmConnection();

            await seedData();

            // -------------Setup GraphQL------------
            const apolloServer = new ApolloServer({
                schema: await buildSchema({
                    resolvers,
                    authChecker: AuthorGraphMiddleware,
                    globalMiddlewares: [graphErrorHandler]
                }),
                playground: true, // TODO remove in production mode
                introspection: true,
                context: async ({ req, res }) => {
                    try {
                        if (!req.headers.authorization) {
                            return { req, res };
                        }

                        const user = await AuthService.verify(req.headers.authorization);

                        if (user instanceof User) {
                            return { req, res, payload: { user } };
                        } else if (user instanceof Customer) {
                            return { req, res, payload: { customer: user } };
                        }
                    } catch (e) {
                        return { req, res };
                    }
                }
            });
            apolloServer.applyMiddleware({
                app: this._app,
                path: '/graph',
                bodyParserConfig: true
            });

            // --------------Setup Restful-------------
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

    private static _setupMultiLanguage() {
        i18n.configure({
            directory: process.env.PWD + '/src/language',
            defaultLocale: 'en',
            locales: ['en', 'vi'],
            fallbacks: {
                vi: 'en'
            },
            cookie: 'resman_language',
            queryParameter: 'lang',
            syncFiles: true,
            objectNotation: true,
            autoReload: true,
            api: {
                __: 't'
            }
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
