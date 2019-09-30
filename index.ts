import { config } from 'dotenv';
import * as bodyParser from 'body-parser';
import express from 'express';
import {Request, Response} from 'express';
import logger from 'morgan';

// Config to use environment variable
config();

// Create port
const port = process.env.PORT || 8000;

export const app: express.Application = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(logger('dev'));

app.get('/api/test', (_req: Request, res: Response) =>
    res.status(200).send({
        message: 'Welcome to simple Nodejs Express typescript run on Heroku project',
    }),
);

app.listen(port, () => {
    console.log('App listening on ' + port);
});