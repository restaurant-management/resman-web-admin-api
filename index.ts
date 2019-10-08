import { config } from 'dotenv';
import * as bodyParser from 'body-parser';
import express from 'express';
import logger from 'morgan';
import path from 'path';
import { createConnections } from 'typeorm';

import seedData from './src/seeder';
import router from './src/router';
import errorHandler from './src/middleware/errorHandler';

// Config to use environment variable
config();

// Create port
const port = process.env.PORT || 8000;

export const app: express.Application = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));

createConnections()
    .then(async _connection => {
        console.info('Connected database!');
        await seedData();
        app.use('/api', router);
        app.use(errorHandler);
    })
    .catch(error => console.log(error));

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));

    app.get('*', (_req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

app.listen(port, () => {
    process.env.NODE_ENV === 'production' ? console.log('App listening on ' + port) : console.log('App running on http://localhost:' + port);
});
