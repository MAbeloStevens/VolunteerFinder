import { Router } from 'express'
const router = Router();

import validation from '../helpers/validation.js';
import id_validation from '../helpers/id_validation.js';
import { allValidTags } from '../helpers/helpers.js';
import { accountData, organizationData, commentData, reviewData, knownTagsData } from '../data/index.js';
import xss from 'xss';

router.route('/session-data').get(async (req, res) => {
  if (req.session.user) {
    res.json(req.session.user)
  } else {
    res.json(false);
  }
});

router.route('/users/login').post(async (req, res) => {
  console.log('testing route: /users/login') //----------------------------DELETE THIS
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
  // validate body inputs for register (see the handlebars file for variable names)
  // if any errors, just render the error page, don't worry about rerendering the form to display the errors
  // call createAccount
  // if successful, redirect to '/login'
  // if any errors, render error page passing error message

  // IMPLEMENT ME
  res.send(req.body)
})

router.route('/users').patch(async (req, res) => {  
  // validate body inputs for editAccount (see the handlebars file for variable names)
  // if any errors, just render the error page, don't worry about rerendering the form to display the errors
  // call updateAccount
  // if successful, redirect to '/account'
  // if any errors, render error page passing error message

  // IMPLEMENT ME
  res.send(req.body)
})

router.route('/users').delete(async (req, res) =>{
  // call deleteAccount for current user
  try{
    // check if user is logged in
    if(!req.session.user){
      res.redirect('/not-logged-in');
    }

    // validate a_id
    const a_id = await id_validation.checkID(req.session.user.a_id, 'Account');


    // Clean up related account data

    // for all owned organizations
    // - for each interested account
    //   - remove interest for this organization
    //     organizationData.removeInterestedAccount
    // - for each comment
    //   - get its comment_id and delete the comment
    // - for each review
    //   - get its review_id and delete the review

    // for all interestedOrgs
    // - remove interest for this organization
    //   organizationData.removeInterestedAccount (will remove interest for account)


    // delete account based on a_id
    await accountData.deleteAccount(a_id);
    
  } catch(e) {
    res.status(500).render('error', {
      title: "Error",
      ecode: 500,
      error: e
    });
    return;
  }

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

router.route('/search').post(async (req, res) => {
  // body parameters: searchTxt (string), tags (list of strings), anyOrAll (string of value 'any' or 'all')
  // searchTxt can be the empty string, tags can be undefined
  let searchTxt = '';
  let tags = [];
  let anyOrAll = 'any';
  try {
    searchTxt = req.body.searchTxt;
    if (searchTxt) {
      if (typeof searchTxt !=='string') throw 'Search text must be a string';
    }
    tags = req.body.tags;
    if (tags){
      if (!Array.isArray(tags) || !allValidTags(tags)) throw 'Tags must be an array of valid tags';
    }
    anyOrAll = req.body.anyOrAll;
    if (!anyOrAll) throw 'anyOrAll must be provided';
    if (typeof anyOrAll !=='string' || (anyOrAll !== 'any' && anyOrAll !== 'all')) throw 'anyOrAll must be a be a string of value \'any\' or \'all\'';
  } catch (e) {
    res.status(400).render('error', {
      title: "Error",
      ecode: 400,
      error: e
    });
    return;
  }

  try {
    // call the organization db function getSearchResults(searchTxt, tags, anyOrAll)
    // the result will be a list of o_ids, and can be the empty list
    let searchResults = await organizationData.getSearchResults(searchTxt, tags, anyOrAll);
    // get the projections of the organizations
    let searchProjections = await organizationData.getOrganizationsTags(searchResults);

    return res.json({searchResults: searchProjections});

  } catch (e) {
    console.trace(e);
    res.status(500).render('error', {
      title: "Error",
      ecode: 500,
      error: e
    });
  }
});

router.route('/createOrg').post(async (req, res) => {
  // validate body inputs
  // if any errors, just render the error page, don't worry about rerendering the form to display the errors
  // put the inputs into an object to work with the db function
  // call createOrganziation, see the organizations.js data file for how to construct the input object
  // if successful, add the orgainization to the current user's account (addOrganizationForAccount)
    // if that errored, you need to delete the organization from the db (deleteOrganization)
      // (if you error out of deletion, just render the error page with this error)
    // then after successfully deleting, render the error page with the error that happened from addOrganizationForAccount

  // if successfully created organization and added it to the admin's account, then redirect to that organization's page

  // IMPLEMENT ME
  res.send(req.body);
});

// functionality on organization page when a user clicks Interested button
router.route('/organizations/:o_id').patch(async (req, res) => {
  // if current user is not logged in, reroute to not logged in
  // validate o_id
  // if false, get the current user and o_id and call org function for setting interested
  // if true, get the current user and o_id and call org function for remove interested
  // if did error, load error page
  // if current user is not logged in, reroute to not logged in
  // if successful, reredirect to this organizations page (cannot use this route as it has /api in front of it)

  //validate o_id
  var o_id = req.params.o_id;

  try {
    o_id = await id_validation.checkOrganizationID(req.params.o_id);
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
  const interested = await accountData.isAccountInterested(currentUser.a_id, o_id);

  try {
    //call org function for setting/removing interested
    if(interested) {
      await organizationData.removeInterestedAccount(o_id, currentUser.a_id);
    } else {
      await organizationData.addInterestedAccount(o_id, currentUser.a_id);
    }
    //redirect to org page
    res.redirect(`/organizations/${o_id}`);
  } catch(e) {
    res.status(500).render('error', {
      title: "Error",
      ecode: 500,
      error: e
    });
  }

});

router.route('/organizations/:o_id').delete(async (req, res) =>{
  // get the organization's adminAccount
  // display error page if user is not the organization admin
  // otherwise, call deleteOrganization
  res.send("IMPLEMENT ME");

  // if successful, redirect to render deletion confirmation page (just uncomment this block below)

  // render organization deletion confirmation page if successfully deleted
  // res.render('deletionConfirmation', {
  //   title: "Organization Deleted",
  //   wasAccount: false,
  // });
});

router.route('/organizations/:o_id/edit').patch(async (req, res) => {
  // validate body inputs for editOrg (see the handlebars file for variable names)
  // if any errors, just render the error page, don't worry about rerendering the form to display the errors
  // call updateOrganization
  // if successful, reload the orgainization's page '/organizations/:o_id'
  // if any errors, render error page passing error message

  // IMPLEMENT ME
  res.send(req.body);
});

router.route('/organizations/:o_id/comment').post(async (req, res) => {
  // validate body inputs for createComment (see the handlebars file for variable names)
  // if any errors, just render the error page, don't worry about rerendering the form to display the errors
  // call createComment
  // if successful, reload the orgainization's page '/organizations/:o_id'
  // if any errors, render error page passing error message

  // IMPLEMENT ME
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
  // validate body inputs for createReview (see the handlebars file for variable names)
  // if any errors, just render the error page, don't worry about rerendering the form to display the errors
  // call createReview
  // if successful, reload the orgainization's page '/organizations/:o_id'
  // if any errors, render error page passing error message

  try{
    //validate o_id
    const o_id = await id_validation.checkOrganizationID(req.params.o_id);

    //checks if user is logged in 
    if (!req.session.user) {
      res.redirect('/not-logged-in');
      return;
    }

    //validate rating and review text
    const {  rating, reviewBody } = req.body;
    const Vrating = await validation.validRating(rating)
    const VReviewBody = await validation.checkReview(reviewBody);

    //create review 
    const newReview = await reviewData.createReview(o_id, Vrating, req.session.user.a_id, VReviewBody);

    //redirect to org page with review
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