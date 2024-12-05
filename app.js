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

app.use(async (req, res, next) => {
    // when logged in, session.user would have these fields
    req.session.user = {a_id: '6734f46960512626d9f23016', firstName: 'Mark', lastName: 'Abelo'};
    next();
}); 

// redirect to not-logged-in when not logged in and trying to access these pages:
// user profile, organization admin, create organization, edit user profile, edit org page, create comment, create review, deletion page
const redirectRoutes_notLoggedIn = [];
app.use(async (req, res, next) => {
    if (redirectRoutes_notLoggedIn.includes(req.path) && !req.session.user) {
        return res.redirect('/not-logged-in');
    } else {
    next();
    }
});

// redirect to landing page when logged in and trying to access these pages
// sign in, sign up, not-logged-in
const redirectRoutes_loggedIn = ['/login', '/register', '/not-logged-in'];
app.use(async (req, res, next) => {
    if (redirectRoutes_loggedIn.includes(req.path) && req.session.user) {
        return res.redirect('/');
    } else {
    next();
    }
});

configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});
