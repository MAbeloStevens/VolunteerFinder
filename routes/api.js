import { Router } from 'express';
const router = Router();

import { accountData, organizationData } from '../data/index.js';
import id_validation from '../helpers/id_validation.js';
import validation from '../helpers/validation.js';

router.route('/session-data').get(async (req, res) => {
  if (req.session.user) {
    res.json(req.session.user)
  } else {
    res.json(false);
  }
});

router.route('/users/login').post(async (req, res) => {
  console.log('testing route: /users/login')
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
  // IMPLEMENT ME

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

  // call the organization db function getSearchResults(searchTxt, tags, anyOrAll)
  // the result will be a list of o_ids, and can be the empty list
  
  // map the result so each item is a projection of the result getOrganizationsInterest
  // IMPORTANT NOTE: this is an async function, so you need to await for all of them
  // it's a little tricky, but here is how I did it for an array of comment ids using 'await Promise.all'
    // let commentsDisplay = await Promise.all(comments.map(getCommentProjection));
    // /* where getCommentProjection is an async function */
  
  // return as res.json({searchResults: ListOfProjections});
  // the case where it is the empty list will be handled by the ajax, so dont worry about that, just do the map and return the json
  
  // IMPLEMENT ME
  res.send(req.body);
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
router.route('/organizations/:o_id').patch(async (req, res) => {
  // if current user is not logged in, reroute to not logged in
  // validate o_id
  // req.body.interested (boolean)
  // if true, get the current user and o_id and call org function for setting interested
  // if false, get the current user and o_id and call org function for remove interested
  // if did error, load error page
  // if successful, reredirect to this organizations page (cannot use this route as it has /api in front of it)
  // IMPLEMENT ME
  res.send(req.body);
});

///api/organizations/{{o_id}}?_method=DELETE
router.route('/organizations/:o_id').delete(async (req, res) =>{
  // get the organization's adminAccount
  // display error page if user is not the organization admin
  // otherwise, call deleteOrganization
  console.log("wtf2");
  let o_id=req.params.o_id;
  try{
    o_id = await id_validation.checkOrganizationID(o_id);
    const adminAccount= getOrganizationAdminAccount(o_id);
    if(adminAccount!==req.session.user.a_id){
      return res.status(400).render("error",{
        title: "Error",
        ecode: 500,
        error: "User is not Organization admin",
      });
    }
    const removed =  organizationData.deleteOrganization(o_id);
    // if successful, redirect to render deletion confirmation page (just uncomment this block below)
    // render organization deletion confirmation page if successfully deleted
    res.render('deletionConfirmation', {
      title: "Organization Deleted",
      wasAccount: false,
    });

  }catch(e){
    return res.status(400).render("error",{
      title: "Error",
      ecode: 500,
      error: e,
    });
  }
});

router.route('/organizations/:o_id/edit').patch(async (req, res) => {
  // validate body inputs for editOrg (see the handlebars file for variable names)
  // if any errors, just render the error page, don't worry about rerendering the form to display the errors
  // call updateOrganization
  // if successful, reload the orgainization's page '/organizations/:o_id'
  // if any errors, render error page passing error message

  // IMPLEMENT ME
  let o_id= req.params.o_id;
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

  // IMPLEMENT ME
  res.send(req.body);
});

router.route('/organizations/:o_id/review').post(async (req, res) => {
  // validate body inputs for createReview (see the handlebars file for variable names)
  // if any errors, just render the error page, don't worry about rerendering the form to display the errors
  // call createReview
  // if successful, reload the orgainization's page '/organizations/:o_id'
  // if any errors, render error page passing error message

  // IMPLEMENT ME
  res.send(req.body);
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