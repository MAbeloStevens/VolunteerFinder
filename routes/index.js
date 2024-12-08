import viewRoutes from './views.js';
import apiRoutes from './api.js';
import {static as staticDir} from 'express';

const constructorMethod = (app) => {
    // defined routes
    app.use('/', viewRoutes);
    app.use('/api', apiRoutes);
    app.use('/public', staticDir('public'));
    app.use('/validation', staticDir('helpers/validation.js'));
    
    // undefined routes
    app.use('*', (req, res) => {
        res.status(404).render('error', {
            title: "Error",
            ecode: 404,
            error: 'Route not Found'
        });
    });
};

export default constructorMethod;