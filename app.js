import express from 'express';
const app = express();

import configRoutes from './routes/index.js';
import cookieParser from 'cookie-parser';
import exphbs from 'express-handlebars';
import Handlebars from 'handlebars';

app.use(cookieParser())
app.use(express.json());
app.use('/public', express.static('public'));
app.use(express.urlencoded({extended: true}));

app.engine('handlebars', exphbs.engine({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

// middleware functions

// app.use(async (req, res, next) => {
//     const expiresAt = new Date();
//     expiresAt.setHours(expiresAt.getMinutes() + 10);
//     res.cookie('user', 'anewuser', {expires: expiresAt});
//     next();
// });
app.use('/account', (req, res, next) => {
    res.redirect('/not-logged-in');
    next();
});

configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});
