import mainRoutes from './main.js';
import {static as staticDir} from 'express';

const constructorMethod = (app) => {
    // defined routes
    app.use('/', mainRoutes);
    app.use('/public', staticDir('public'));
    
    // undefined routes
    app.use('*', (req, res) => {
        res.status(404).json({error: 'Route not Found'});
    });
};

export default constructorMethod;