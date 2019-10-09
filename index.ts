import { config } from 'dotenv';
import { Application } from './src/lib/application';
import 'reflect-metadata';

// Config to use environment variable
config();

// Create port
const PORT = process.env.PORT || 8000;

Application.getApp().then(app =>
    app.listen(PORT, () => {
        process.env.NODE_ENV === 'production' ? console.log('App listening on ' + PORT) : console.log('App running on http://localhost:' + PORT);
    })
);
