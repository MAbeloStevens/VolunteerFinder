import viewRoutes from './views.js';
import apiRoutes from './api.js';
import {static as staticDir} from 'express';

const constructorMethod = (app) => {
    // defined routes
    app.use('/', viewRoutes);
    app.use('/api', apiRoutes);
    app.use('/public', staticDir('public'));
    app.use('/helpers', staticDir('helpers'))
    
    // undefined routes
    app.use('*', (req, res) => {
        res.status(404).json({error: 'Route not Found'});
    });
};

export default constructorMethod;