import { config } from 'dotenv';
import 'reflect-metadata';
import { Application } from './src/lib/application';
import { createSocket } from './src/socket';

// Config to use environment variable
config();

// Create port
const PORT = process.env.PORT || 8000;

if (process.env.NODE_ENV === 'reset_test_database') {
    Application.getApp();
}

Application.getApp().then(app => {
    const server = app.listen(PORT, () => {
        process.env.NODE_ENV === 'production' ? console.log('App listening on ' + PORT) : console.log('App running on http://localhost:' + PORT);
    });

    createSocket(server);
});
