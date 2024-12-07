import express from 'express';
const app = express();

import configRoutes from './routes/index.js';
import session from 'express-session';
import exphbs from 'express-handlebars';
import Handlebars from 'handlebars';
import methodOverride from 'method-override';

app.use(express.json());
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

// handlebars functions

// returns true if the item is in the list
Handlebars.registerHelper("listContains", function(item, List) {
    return List.includes(item);
});

// middleware functions

// to test logged in functionality, REMOVE when log in works
// app.use(async (req, res, next) => {
//     // when logged in, session.user would have these fields
//     let firstName = 'Mark';
//     let lastName = 'Abelo';
//     req.session.user = {a_id: '6734f46960512626d9f23016'};
//     res.locals.user_name =  `${firstName} ${lastName}`;
//     next();
// }); 

// not-logged-in and logged-in redirection
const redirectRoutes_notLoggedIn = ['/account', '/account/edit', '/organizations/:o_id/comment', '/account/delete', '/organizations/:o_id/review'];
// user profile, organization admin(need route), create organization(need route), edit user profile, edit org page(need route), create comment, create review, deletion page
const redirectRoutes_loggedIn = ['/login', '/register', '/not-logged-in'];
app.use('/', async (req, res, next) => {

    // redirect to not-logged-in when not logged in and trying to access these pages:
    if (redirectRoutes_notLoggedIn.includes(req.path) && !req.session.user) {
        return res.redirect('/not-logged-in');
    }
    
    // redirect to landing page when logged in and trying to access these pages
    if (redirectRoutes_loggedIn.includes(req.path) && req.session.user) {
        return res.redirect('/');
    } 
    next();
});

// if trying to go to an account page that is user's own account, redirect to /account 
app.use('/account/accountPage/:a_id', async (req, res, next) => {
    if (req.params.a_id === req.session.user.a_id) {
        return res.redirect('/account');
    }
    next();
});

configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});
