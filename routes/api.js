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
  // when a user clicks Interested
  // req.body.interested (boolean)
  // if true, get the current user and o_id and call org function for setting interested
  // if false, get the current user and o_id and call org function for remove interested
  // if did not error, reroute to get method for this route
  // if did error, load error page
  // if current user is not logged in, reroute to not logged in


  //check if user is logged 
  if (!req.session.user) {
    res.redirect('/not-logged-in');
    return;
  }

  //validate o_id
  var o_id = req.params.o_id;

  try {
    o_id = id_validation.checkOrganizationID(req.params.o_id);
  } catch (e) {
    res.status(400).render('error', {
      title: "Error",
      ecode: 400,
      error: e
    });
    return;
  }

  //get current user 
  const currentUser = req.session.user;
  const interested = req.body.interested;

  try {
    //call org function for setting/removing interested
    if(interested) {
      await organizationData.addInterestedAccount(o_id, currentUser.a_id);
    } else {
      await organizationData.removeInterestedAccount(o_id, currentUser.a_id);
    }

    //redirect to org page
    res.redirect(`/organization/${o_id}`);
  } catch(e) {
    console.trace(e);
    res.status(500).render('error', {
      title: "Error",
      ecode: 500,
      error: e
    });
  }

});

router.route('/organizations/:o_id/comment').post(async (req, res) => {
  //TODO Replace with saving comment to database
  try {
    //validate o_id
    const o_id = await id_validation.checkOrganizationID(req.params.o_id);

    //checks if user is logged in 
    if (!req.session.user) {
      res.redirect('/not-logged-in');
      return;
    }

    //get comment body
    const commentBody = await validation.checkComment(req.body);

    //create comment 
    const comment = await commentData.createComment(o_id, req.session.user.a_id, commentBody);

    //redirect to org page with comment
    res.redirect(`/organization/${o_id}`);
  } catch (e) {
    console.trace(e);
    res.status(400).render('error', {
      title: "Error",
      ecode: 400,
      error: e
    });
    return;
  }
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

router.route('/organizations/:o_id/comment/:comment_id/delete').delete(async (req, res) =>{
  // middleware changes method for this route to delete
  // delete the comment from organization and reload organization page
  // display error page if user is not the organization admin or comment author
  res.send("IMPLEMENT ME");
});

router.route('/organizations/:o_id/review/:review_id/delete').delete(async (req, res) =>{
  // middleware changes method for this route to delete
  // delete the review from organization and reload organization page
  // display error page if user is not the organization admin or review author
  res.send("IMPLEMENT ME");
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