import express, { NextFunction } from 'express';
import i18next from 'i18next';
import i18nextMiddleware from 'i18next-express-middleware';
import Backend from 'i18next-node-fs-backend';

export const multiLanguage = async (app: express.Application) => {
    await i18next
        .use(Backend)
        .use(i18nextMiddleware.LanguageDetector).init({
            backend: {
                loadPath: process.env.PWD + '/src/language/{{lng}}/{{ns}}.json',
                addPath: process.env.PWD + '/src/language/{{lng}}/{{ns}}.missing.json'
            },
            fallbackLng: 'en',
            preload: ['en', 'vi'],
            saveMissing: true,
            detection: {
                order: ['querystring', 'cookie'],
                caches: ['cookie']
            },
            debug: true,
            initImmediate: false,
        });

    app.use(i18nextMiddleware.handle(i18next, { removeLngFromUrl: false }));

    return (_req: any, _res: any, next: NextFunction) => next();
};
