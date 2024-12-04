import express from 'express';
const app = express();

import configRoutes from './routes/index.js';
import session from 'express-session';
import exphbs from 'express-handlebars';
import Handlebars from 'handlebars';
import methodOverride from 'method-override';

app.use(express.json());
app.use('/public', express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'))

// express session config
app.use(session({
    name: 'AuthenticationState',
    secret: '2024_secret_KMLK',
    resave: false,
    saveUninitialized: false
}));

app.engine('handlebars', exphbs.engine({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

// middleware functions

// app.use(async (req, res, next) => {
//     req.session.
//     expiresAt.setHours(expiresAt.getMinutes() + 10);
//     res.cookie('user', 'anewuser', {expires: expiresAt});
//     next();
// });


configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});
