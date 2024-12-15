import { Router } from 'express';
const router = Router();

import id_validation from '../helpers/id_validation.js';
import validation from '../helpers/validation.js';
import { accountData, commentData, organizationData, reviewData, knownTagsData } from '../data/index.js';
import { allValidTags } from '../helpers/helpers.js';
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
  req.body.tags = typeof req.body.tags === 'string' ? [req.body.tags] : req.body.tags
  // validate body inputs for register (see the handlebars file for variable names)
  // if any errors, just render the error page, don't worry about rerendering the form to display the errors
  // call createAccount
  // if successful, redirect to '/login'
  // if any errors, render error page passing error message
  let {firstName, lastName, password, confirmPassword, email, phone, tags} =req.body
  console.log(req.body)
  try{
    if(!firstName ||!lastName ||!password || !email) throw 'First name, last name, email, and password are required!';
    firstName = await validation.checkName(firstName);
    lastName = await validation.checkName(lastName);
    //password hashing
    password = await validation.checkPassword(password);
    if (password!==confirmPassword){
      throw "Confirm password does not match password"
    }

    tags = await validation.checkTags(tags)
    tags = validation.properCaseTags(tags)

    email = await validation.checkEmail(email);
    if(phone){
        phone = await validation.checkPhone(phone);
    }
  }catch(e){
    res.status(400).render('error', {
      title: "Error",
      ecode: 400,
      error: e
    });
    return
  }
  try{
    const addUser= await accountData.createAccount(firstName,lastName,password,tags,email,phone);
    res.redirect('/login');
    return 
  }
  catch(e){
    res.status(500).render('error', {
      title: "Error",
      ecode: 500,
      error: e
    });
    return
  }
})

router.route('/users')
.patch(async (req, res) => {  
  // validate body inputs for editAccount (see the handlebars file for variable names)
  // if any errors, just render the error page, don't worry about rerendering the form to display the errors
  // call updateAccount
  // if successful, redirect to '/account'
  // if any errors, render error page passing error message
  const a_id = req.session.user.a_id
  let {firstName, lastName, phone, tags} = req.body
  try{
    if(!firstName ||!lastName ||!tags) throw 'First name, last name, and tags are required!';
    firstName = await validation.checkName(firstName);
    lastName = await validation.checkName(lastName);

    tags = await validation.checkTags(tags)
    tags = validation.properCaseTags(tags)

    if(phone){
      phone = await validation.checkPhone(phone);
    }
  }catch(e){
    res.status(400).render('error', {
      title: "Error",
      ecode: 400,
      error: e
    });
    return
  }
  try{
    const updateUser= await accountData.updateAccount(a_id,firstName,lastName,tags,phone)
    res.redirect('/account');
    return
  }catch(e){
    res.status(500).render('error', {
      title: "Error",
      ecode: 500,
      error: e
    });
    return
  }
})
.delete(async (req, res) =>{
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

    // call deleteCommentsByAccount for this account
    // call deleteReviewsByAccount for this account


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
  req.body.tags = typeof req.body.tags === 'string' ? [req.body.tags] : req.body.tags
  // validate body inputs
  // if any errors, just render the error page, don't worry about rerendering the form to display the errors
  // put the inputs into an object to work with the db function
  // call createOrganziation, see the organizations.js data file for how to construct the input object
  // if successful, add the orgainization to the current user's account (addOrganizationForAccount)
    // if that errored, you need to delete the organization from the db (deleteOrganization)
      // (if you error out of deletion, just render the error page with this error)
    // then after successfully deleting, render the error page with the error that happened from addOrganizationForAccount

  // if successfully created organization and added it to the admin's account, then redirect to that organization's page
  let orgInfo = req.body;
  if(!orgInfo || Object.keys(orgInfo).length === 0){
    return res.status(500).render("error",
      {
        title: "Error",
        ecode: 400,
        error: "Please input required fields",
      });
  }
  const fields= [
    {key:'name', message: "Organization name is missing"},
    {key:'tags', message: "Organization tags are missing"},
    {key:'description', message: "Organization description is missing"},
    {key:'contact', message:"Organization contact information is missing"},
  ]
  for (const field of fields){
    if(!orgInfo[field.key]){
      return res.status(400).render("error",{
        title: "Error",
        ecode: 400,
        error: field.message,
      });
    }
  }
  //validation checks
  try{
    orgInfo.name = await validation.checkName(orgInfo.name);
    orgInfo.tags= await validation.checkTags(orgInfo.tags);
    orgInfo.description= await validation.checkDescription(orgInfo.description)
    orgInfo.contact= await validation.checkContact(orgInfo.contact)
    orgInfo.adminAccount= req.session.user.a_id
    
    //optional link 
    if(orgInfo.link){
      orgInfo.link = await validation.checkLink(orgInfo.link)
    }
    //this is the image path 
    if(req.file && req.file.path){
      orgInfo.bannerImg= req.file.path
    }
  }catch(e){
    return res.status(400).render("error",{
      title: "Error",
      ecode: 400,
      error: e,
    });
  }
  //time to add it to the db 
  let newOrg= undefined;
  try{
    newOrg= await organizationData.createOrganziation(orgInfo);
  }catch(e){
    return res.status(500).render("error",{
      title: "Error",
      ecode: 500,
      error: e,
    });
  }
  try{
    const addOrgToAccount=await accountData.addOrganizationForAccount(orgInfo.adminAccount,newOrg)
  }catch(e){
    //delete org
    try{
      const deleteOrg= await organizationData.deleteOrganization(newOrg)
    }catch(e){
      return res.status(500).render("error",{
        title: "Error",
        ecode: 500,
        error: e,
      });
    }
    //return error
    return res.status(500).render("error",{
      title: "Error",
      ecode: 500,
      error: e,
    });
  }
  return res.redirect(`/organizations/${newOrg}`);
});

// functionality on organization page when a user clicks Interested button
router.route('/organizations/:o_id')
.delete(async (req, res) =>{
  // /api/organizations/{{o_id}}?_method=DELETE
  // get the organization's adminAccount
  // display error page if user is not the organization admin
  // otherwise, call deleteOrganization
  console.log("wtf2");
  let o_id = req.params.o_id;
  let ecode = 500;
  try{
    o_id = await id_validation.checkOrganizationID(o_id);
    const adminAccount= await organizationData.getOrganizationAdminAccount(o_id);
    if(adminAccount!==req.session.user.a_id){
      ecode = 400;
      throw "User is not Organization admin";
    }
    const removed =  await organizationData.deleteOrganization(o_id);
    // if successful, redirect to render deletion confirmation page (just uncomment this block below)
    // render organization deletion confirmation page if successfully deleted
    res.render('deletionConfirmation', {
      title: "Organization Deleted",
      wasAccount: false,
    });
    return;

  }catch(e){
    console.trace(e); // ------------------------------DELETE THIS
    res.status(ecode).render("error",{
      title: "Error",
      ecode: ecode,
      error: e,
    });
    return;
  }
})
.patch(async (req, res) => {
  req.body.tags = typeof req.body.tags === 'string' ? [req.body.tags] : req.body.tags
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
    console.trace(e); // ------------------------------DELETE THIS
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

router.route('/organizations/:o_id/edit').patch(async (req, res) => {
  // validate body inputs for editOrg (see the handlebars file for variable names)
  // if any errors, just render the error page, don't worry about rerendering the form to display the errors
  // call updateOrganization
  // if successful, reload the orgainization's page '/organizations/:o_id'
  // if any errors, render error page passing error message

  let o_id= req.params.o_id;
  let orgInfo = req.body;
  if(!orgInfo || Object.keys(orgInfo).length === 0){
    return res.status(400).render("error",
      {
        title: "Error",
        ecode: 400,
        error: "Please input required fields",
      });
  }
  const fields= [
    {key:'name', message: "Organization name is missing"},
    {key:'tags', message: "Organization tags are missing"},
    {key:'description', message: "Organization description is missing"},
    {key:'contact', message:"Organization contact information is missing"},
  ]
  for (const field of fields){
    if(!orgInfo[field.key]){
      return res.status(400).render("error",{
        title: "Error",
        ecode: 400,
        error: field.message,
      });
    }
  }
  //validation checks
  try{
    o_id = await id_validation.checkOrganizationID(o_id);
    orgInfo.name = await validation.checkName(orgInfo.name);
    orgInfo.tags= await validation.checkTags(orgInfo.tags);
    orgInfo.description= await validation.checkDescription(orgInfo.description)
    orgInfo.contact= await validation.checkContact(orgInfo.contact)
    orgInfo.adminAccount= req.session.user.a_id
    
    //optional link 
    if(orgInfo.link){
      orgInfo.link = await validation.checkLink(orgInfo.link)
    }
    //this is the image path 
    if(req.file && req.file.path){
      orgInfo.bannerImg= req.file.path
    }
  }catch(e){
    return res.status(400).render("error",{
      title: "Error",
      ecode: 400,
      error: e,
    });
  }
  //time to update it
  let updateOrg= undefined;
  try{
    updateOrg= await organizationData.updateOrganization(o_id,orgInfo.name, orgInfo.tags, orgInfo.bannerImg, orgInfo.description, orgInfo.contact, orgInfo.link);
  }
  catch(e){
    return res.status(500).render("error",{
      title: "Error",
      ecode: 500,
      error: e,
    });
  }
  return res.redirect(`/organizations/${updateOrg}`);
});

router.route('/organizations/:o_id/comment').post(async (req, res) => {
  // validate body inputs for createComment (see the handlebars file for variable names)
  // if any errors, just render the error page, don't worry about rerendering the form to display the errors
  // call createComment
  // if successful, reload the orgainization's page '/organizations/:o_id'
  // if any errors, render error page passing error message
  let commentBody = req.body.comment;

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
    commentBody = await validation.checkComment(commentBody);

    //create comment 
    const comment = await commentData.createComment(o_id, req.session.user.a_id, commentBody);

    //redirect to org page with comment
    res.redirect(`/organizations/${o_id}`);
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
  let {  rating, review } = req.body;
  rating = Number(rating);

  try{
    //validate o_id
    const o_id = await id_validation.checkOrganizationID(req.params.o_id);

    //checks if user is logged in 
    if (!req.session.user) {
      res.redirect('/not-logged-in');
      return;
    }

    //validate rating and review text
    const Vrating = await validation.validRating(rating)
    const VReviewBody = await validation.checkReview(review);

    //create review 
    const newReview = await reviewData.createReview(o_id, Vrating, req.session.user.a_id, VReviewBody);

    //redirect to org page with review
    res.redirect(`/organizations/${o_id}`);
  } catch (e) {
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

  let o_id = req.params.o_id;
  let comment_id = req.params.comment_id;
  try {
    // validate route parameters
    o_id = await id_validation.checkID(o_id, 'Organization');
    comment_id = await id_validation.checkID(comment_id, 'Comment');
  } catch (e) {
    res.status(400).render('error', {
      title: "Error",
      ecode: 400,
      error: e
    });
    return;
  }

  let ecode = 500;
  try {
    // get organization admin
    let orgEditInfo = await organizationData.getOrganizationEditInfo(o_id)
    // get comment info
    let commentFound = await commentData.getComment(o_id, comment_id);
    // ensure that user is the comment author or organization admin
    let currentUser_id = undefined;
    if (req.session.user){
      currentUser_id = req.session.user.a_id;
    }
    if (currentUser_id !== orgEditInfo.adminAccount && currentUser_id !== commentFound.author){
      ecode = 400;
      throw 'You cannot delete a comment if you are not its author or the organization\'s admin';
    }
  
    // delete comment
    const commentDeleted = await commentData.deleteComment(o_id, comment_id);
    if (!commentDeleted) throw 'Could not delete comment';
    // reload organization page
    res.redirect(`/organizations/${o_id}`);
  } catch (e) {
    res.status(ecode).render('error', {
      title: "Error",
      ecode: ecode,
      error: e
    });
    return;
  }
});

router.route('/organizations/:o_id/review/:review_id/delete').delete(async (req, res) =>{
  // middleware changes method for this route to delete
  // delete the review from organization and reload organization page
  // display error page if user is not the organization admin or review author
  
  let o_id = req.params.o_id;
  let review_id = req.params.review_id;
  try {
    // validate route parameters
    o_id = await id_validation.checkID(o_id, 'Organization');
    review_id = await id_validation.checkID(review_id, 'Review');
  } catch (e) {
    res.status(400).render('error', {
      title: "Error",
      ecode: 400,
      error: e
    });
    return;
  }

  let ecode = 500;
  try {
    // get organization admin
    let orgEditInfo = await organizationData.getOrganizationEditInfo(o_id)
    // get review info
    let reviewFound = await reviewData.getReview(o_id, review_id);
    // ensure that user is the review author or organization admin
    let currentUser_id = undefined;
    if (req.session.user){
      currentUser_id = req.session.user.a_id;
    }
    if (currentUser_id !== orgEditInfo.adminAccount && currentUser_id !== reviewFound.author){
      ecode = 400;
      throw 'You cannot delete a review if you are not its author or the organization\'s admin';
    }

    // delete review
    const reviewDeleted = await reviewData.deleteReview(o_id, review_id);
    if (!reviewDeleted) throw 'Could not delete review';
    // reload organization page
    res.redirect(`/organizations/${o_id}`);
  } catch (e) {
    res.status(ecode).render('error', {
      title: "Error",
      ecode: ecode,
      error: e
    });
    return;
  }
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