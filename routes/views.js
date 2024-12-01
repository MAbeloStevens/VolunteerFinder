import express from 'express';
const router = express.Router();

import validation from '../helpers/validation.js';
import { organizationData } from '../data/index.js';


router.route('/').get(async (req, res) => {
  res.render('landing', {
    title: '',
    script_partial: 'landing_script'
  });
});


router.route('/login').get(async (req, res) => {
  res.render('login', {
    title: 'Log in',
    script_partial: 'login_script'
  });
});


router.route('/register').get(async (req, res) => {
  // TODO: swap out for list from database
  const knownTags = ["Afterschool Programs", "Assisting People with Disabilities", "Blood Donation Drives", "Clothing Drives"]
  res.render('register', {
    title: 'Register an account',
    script_partial: 'register_script',
    knownTags: knownTags
  });
});


router.route('/account').get(async (req, res) => { 
  // get id of currently logged in user from authentication system.
  // Validate Id -> trade for user
  res.render('account', {
    title: 'Welcome ...',
    script_partial: 'account_script'
    // user: user
  });
});

router.route('/organization:id').get(async (req, res) => {
  // validate o_id
  try{
    req.params.id = validation.checkID(req.params.id, 'organization id');
  } catch (e) {
    res.status(500).render('error', {
      title: "Error",
      ecode: 500,
      error: e
    });
  }

  // get organization data
  try {
    const orgFound = await organizationData.getOrganizationPageData(req.params.id);
    if(!orgFound) {
      res.status(404).render('error', {
        title: "Error",
        ecode: 404,
        error: "organization not found"
      });
    }

    // render page
    res.render('organization', {
      title: orgFound.name,
      orgData: orgFound,
      script_partial: 'organization_script'
    });
      
  } catch (e) {
    res.status(500).render('error', {
        title: "Error",
        ecode: 500,
        error: e
    });
  }
  
});

router.route('/not-logged-in').get(async (req, res) => {
  res.render('not-logged-in', {
    title: 'Please Log In To Use This Feature'
  });
});


export default router;