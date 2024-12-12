import { Router } from 'express'
const router = Router();

import validation from '../helpers/validation.js';
import id_validation from '../helpers/id_validation.js';
import { accountData, organizationData, commentData, reviewData, knownTagsData } from '../data/index.js';

router.route('/session-data').get(async (req, res) => {
  if (req.session.user) {
    res.json(req.session.user)
  } else {
    res.json(false);
  }
});

router.route('/users/login').post(async (req, res) => {
  //TODO: Need DB functions
  let email = req.body.email;
  let password = req.body.password;
  
  let currentUser = undefined;

  try {
    // validate inputs, rerender page if errors
    email = await validation.checkEmail(email);
    password = await validation.checkPassword(password);

    // call db function, rerender page if can't validate
    currentUser = await accountData.getLogInInfo(email, password);
  } catch (e) {
    console.trace(e);
    res.render('login', {
      title: 'Log in',
      script_partial: 'login_script',
      error: e
    });
    return;
  }

  // set session user
  req.session.user = currentUser;
  // redirect to root
  res.redirect('/');
})

router.route('/users/register').post(async (req, res) => {
  //TODO: replace with saving entry to database
  // validate inputs

  // create user in database

  // redirect to login
  res.send(req.body)
})

router.route('/users').patch(async (req, res) => {
  //TODO: replace with saving entry to database
  res.send(req.body)
})

router.route('/search').post(async (req, res) => {
  res.send(req.body);
});

router.route('/createOrg').post(async (req, res) => {
  // IMPLEMENT ME
  res.send(req.body);
});

router.route('/organization/:o_id').patch(async (req, res) => {
  // 
});

router.route('/organizations/:o_id/comment').post(async (req, res) => {
  //TODO Replace with saving comment to database
  res.send(req.body);
});

router.route('/organizations/:o_id/review').post(async (req, res) => {
  //TODO Replace with saving review to database
  res.send(req.body);
});

router.route('/account/edit').post(async (req, res) => {
  // TODO update account db based on new info
  res.send("IMPLEMENT ME");
});

router.route('/users').delete(async (req, res) =>{
  //TODO Delete the account by a_id of the currently logged in user

  // destroy session
  req.session.destroy((e) => {
    if (e) {
      res.status(500).render('error', {
        title: "Error",
        ecode: 500,
        error: e
      });
    } else {
      delete res.locals.user_name;
      // render account deletion confirmation page
      res.render('deletionConfirmation', {
        title: "Account Deleted",
        wasAccount: true,
      });
    }
  });
});

router.route('/organizations/:o_id').delete(async (req, res) =>{
  //TODO Delete the organization by o_id of the currently logged in user
  
  // render organization deletion confirmation page
  res.render('deletionConfirmation', {
    title: "Organization Deleted",
    wasAccount: false,
  });
});

router.route('/logout').get(async (req, res) => {
  req.session.destroy((e) => {
    if (e) {
      res.status(500).render('error', {
        title: "Error",
        ecode: 500,
        error: e
      });
    } else {
      delete res.locals.user_name;
      res.redirect('/');
    }
  });
});

export default router;