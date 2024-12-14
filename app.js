import express from 'express';
const app = express();

import exphbs from 'express-handlebars';
import session from 'express-session';
import Handlebars from 'handlebars';
import methodOverride from 'method-override';
import { upload } from './helpers/helpers.js';
import configRoutes from './routes/index.js';

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

// returns true if the item is in the list
Handlebars.registerHelper("listEmpty", function(List) {
    return List.length == 0;
});

// given a name string, returns their name followed by 's or ' given if their name ends with an s
Handlebars.registerHelper("nameApostrophe", function(name) {
    if (name.slice(-1) == 's') {
        return (name + '\'');
    }
    return (name + '\'s');
});

// given text body containing line breaks, exchanges those for html <br>
Handlebars.registerHelper("breaklines", function(textBody) {
    textBody = Handlebars.Utils.escapeExpression(textBody);
    textBody = textBody.replace(/(\r\n|\n|\r)/gm, '<br>');
    return new Handlebars.SafeString(textBody);
});


// middleware functions

// not-logged-in and logged-in redirection
const redirectRoutes_notLoggedIn = ['/account', '/orgAdmin', '/createOrg', '/account/edit', '/account/delete'];
const redirectRoutes_loggedIn = ['/login', '/register', '/not-logged-in'];
app.use('/', async (req, res, next) => {
    // if logged in, set local variable user name for navBar rendering
    if (req.session.user) {
        res.locals.user_name =  `${req.session.user.firstName} ${req.session.user.lastName}`;
    }

    // redirect to not-logged-in when not logged in and trying to access these pages:
    if (!req.session.user && redirectRoutes_notLoggedIn.includes(req.path)) {
        return res.redirect('/not-logged-in');
    }
    
    // redirect to landing page when logged in and trying to access these pages
    if (req.session.user && redirectRoutes_loggedIn.includes(req.path)) {
        return res.redirect('/');
    } 
    next();
});

// if trying to go to an account page that is user's own account, redirect to /account 
app.use('/account/accountPage/:a_id', async (req, res, next) => {
    if (req.session.user && (req.params.a_id === req.session.user.a_id)) {
        return res.redirect('/account');
    }
    next();
});


//middleware for images
app.use('/createOrg', upload.single('bannerImg'), async(req, res, next)=>{
    try{
        //image is optional so you should be able to go next
        if(!req.file){
            return res.status(200).json({message: 'No file uploaded, proceed without image'})
        }
        res.json({ message: 'File uploaded successfully!', filePath: req.file.path });
    }catch(e){
        res.status(400).json({ error: e.message });
    }
    next()
})

// if you are trying to comment, review, edit or delete an organization, while not logged in, redirect to not-logged-in
app.use('/organizations/:o_id', async (req, res, next) => {
    const orgViews_notLoggedIn = ['/edit', '/delete', '/comment', '/review']
    if (!req.session.user && orgViews_notLoggedIn.includes(req.path.replace('/organizations/:o_id',''))) {
        return res.redirect('/not-logged-in');
    }
    next();
});


configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});
