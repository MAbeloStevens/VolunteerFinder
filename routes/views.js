import { Router } from 'express';
const router = Router();

import { accountData, knownTagsData, organizationData } from '../data/index.js';
import id_validation from '../helpers/id_validation.js';


router.route('/').get(async (req, res) => {
  let recommendedOrgs = undefined;

  if(req.session.user) {
    // get user data
    let userData = await accountData.getAccountDisplayData(req.session.user.a_id);
    recommendedOrgs=await organizationData.getRecommendedOrgs(userData.tags,req.session.user.a_id)
  }

  // get most interested orgs
  let mostInterestedOrgs= await organizationData.getMostInterestedOrgs();
  // render page  
  res.render('landing', {
    title: '',
    recommendedOrgs: recommendedOrgs,
    mostInterestedOrgs: mostInterestedOrgs
  });
});


router.route('/not-logged-in').get(async (req, res) => {
  res.render('not-logged-in', {
    title: 'Please Log In To Use This Feature'
  });
});


router.route('/login').get(async (req, res) => {
  res.render('login', {
    title: 'Log in',
    script_partial: 'login_script'
  });
});


router.route('/register').get(async (req, res) => {
  // get all known tags
  let knownTags;
  try {
    knownTags = await knownTagsData.getKnownTags();
  } catch (e) {
    res.status(500).render('error', {
      title: "Error",
      ecode: 500,
      error: e
    });
    return;
  }
  
  res.render('register', {
    title: 'Register an account',
    script_partial: 'register_script',
    knownTags: knownTags
  });
});


router.route('/account').get(async (req, res) => {
  try {
    // get account info
    const user = await accountData.getAccount(req.session.user.a_id);

    // get projections of interestedOrgs and organizations
    user.interestedOrgs = await organizationData.getOrganizationsTags(user.interestedOrgs);
    user.organizations = await organizationData.getOrganizationsTags(user.organizations);

    // get id of currently logged in user from authentication system.
    res.render('account', {
      title: `${user.firstName} ${user.lastName}`,
      owner: true,
      user: user
    });
  } catch (e) {
    res.status(500).render('error', {
      title: "Error",
      ecode: 500,
      error: e
    });
  }
})


router.route('/account/edit').get(async (req, res) => {
  try {
    // get all known tags
    let knownTags = await knownTagsData.getKnownTags();
    // get account info
    const user = await accountData.getAccount(req.session.user.a_id);

    res.render('editAccount', {
      title: 'Edit Account',
      user: user,
      knownTags: knownTags,
      userTags: user.tags,
      script_partial: 'editAccount_script'
    });

  } catch (e) {
    res.status(500).render('error', {
      title: "Error",
      ecode: 500,
      error: e
    });
  }
});


router.route('/account/delete').get(async (req, res) => {
  res.render('accountDeletion', {
    title: 'Delete Account'
  });
});


router.route('/account/accountPage/:a_id').get(async (req, res) => {
  try {
    // validate a_id
    req.params.a_id = await id_validation.checkID(req.params.a_id, 'Account');
  } catch (e) {
    res.status(500).render('error', {
      title: "Error",
      ecode: 500,
      error: e
    });
    return;
  }

  // get organization data
  try {
    const accountFound = await accountData.getAccount(req.params.a_id);
    if (!accountFound) {
      res.status(404).render('error', {
        title: "Error",
        ecode: 404,
        error: "Account not found"
      });
      return
    }

    // get projections of interestedOrgs and organizations
    accountFound.interestedOrgs = await organizationData.getOrganizationsTags(accountFound.interestedOrgs);
    accountFound.organizations = await organizationData.getOrganizationsTags(accountFound.organizations);

    // render page
    res.render('account', {
      title: `${accountFound.firstName} ${accountFound.lastName}`,
      user: accountFound,
    });

  } catch (e) {
    res.status(500).render('error', {
      title: "Error",
      ecode: 500,
      error: e
    });
  }
});


router.route('/search').get(async (req, res) => {
  // get all known tags
  let knownTags;
  try {
    knownTags = await knownTagsData.getKnownTags();
  } catch (e) {
    res.status(500).render('error', {
      title: "Error",
      ecode: 500,
      error: e
    });
    return;
  }
  // render the search page asking for parameters
  res.render('search', {
    title: 'Search Organization',
    script_partial: 'search_script',
    knownTags: knownTags
  });
});


router.route('/orgAdmin').get(async (req, res) => {
  try {
    // get user's organization list
    let user_organizations = await accountData.getAccountOrganizations(req.session.user.a_id);

    // call getOrganizationsInterest
    let ownedOrgs = await organizationData.getOrganizationsInterest(user_organizations);
    // for all organizations in the list, map interestedAccounts to be the projection returned by getAccountNames
    ownedOrgs = await Promise.all(ownedOrgs.map(async (org) => {
      org.interestedAccounts = await accountData.getAccountNames(org.interestedAccounts);
      return org;
    }));
    // render page
    res.render('orgAdmin', {
      title: 'Organization Admin',
      ownedOrgs: ownedOrgs
    });

  } catch (e) {
    res.status(500).render('error', {
      title: "Error",
      ecode: 500,
      error: e
    });
  }
});


router.route('/organizations/:o_id').get(async (req, res) => {

  // validate o_id
  try {
    req.params.o_id = await id_validation.checkOrganizationID(req.params.o_id);
  } catch (e) {
    res.status(400).render('error', {
      title: "Error",
      ecode: 400,
      error: e
    });
    return;
  }

  // get current user and set userIsInterested if logged in
  let currentUser_id = undefined;
  let userIsInterested = undefined;
  if (req.session.user) {
    currentUser_id = req.session.user.a_id;
    userIsInterested = await accountData.isAccountInterested(currentUser_id, req.params.o_id);
  }

  // get organization data
  let orgFound;
  try {
    orgFound = await organizationData.getOrganizationPageData(req.params.o_id, currentUser_id);
  } catch(e) {
    res.status(404).render('error', {
      title: "Error",
      ecode: 404,
      error: e
    });
    return
  }

  try {
    // get adminInfo
    const adminInfo = await accountData.getAccountFullName(orgFound.adminAccount);

    // if the current user is the owner, set owner to true
    let owner = undefined;
    if (currentUser_id === orgFound.adminAccount) {
      // if the current user is the owner, set owner to true
      owner = true;
    }

    // render page
    res.render('organization', {
      title: orgFound.name,
      o_id: req.params.o_id,
      organization: orgFound,
      adminInfo: adminInfo,
      owner: owner,
      userIsInterested: userIsInterested,
    });

  } catch (e) {
    res.status(500).render('error', {
      title: "Error",
      ecode: 500,
      error: e
    });
  }

});


router.route('/organizations/:o_id/comment').get(async (req, res) => {
  // validate o_id
  try {
    req.params.o_id = await id_validation.checkOrganizationID(req.params.o_id);
  } catch (e) {
    res.status(400).render('error', {
      title: "Error",
      ecode: 400,
      error: e
    });
    return;
  }

  // get organization data
  let orgFound;
  try {
    orgFound = await organizationData.getOrganizationName(req.params.o_id);
  } catch(e) {
    res.status(404).render('error', {
      title: "Error",
      ecode: 404,
      error: e
    });
    return
  }

  res.render('createComment', {
    title: 'Post a comment',
    organization: orgFound,
    script_partial: 'createComment_script'
  });
});


router.route('/organizations/:o_id/review').get(async (req, res) => {
  // validate o_id
  try {
    req.params.o_id = await id_validation.checkOrganizationID(req.params.o_id);
  } catch (e) {
    res.status(400).render('error', {
      title: "Error",
      ecode: 400,
      error: e
    });
    return;
  }

  // get organization data
  let orgFound;
  try {
    orgFound = await organizationData.getOrganizationName(req.params.o_id);
  } catch(e) {
    res.status(404).render('error', {
      title: "Error",
      ecode: 404,
      error: e
    });
    return
  }

  res.render('createReview', {
    title: 'Leave a Review',
    organization: orgFound,
    script_partial: 'createReview_script'
  });
});


router.route('/organizations/:o_id/delete').get(async (req, res) => {
  // validate o_id
  try {
    req.params.o_id = await id_validation.checkOrganizationID(req.params.o_id);
  } catch (e) {
    res.status(400).render('error', {
      title: "Error",
      ecode: 400,
      error: e
    });
    return;
  }

  // get current user
  let currentUser_id = undefined;
  if (req.session.user){
    currentUser_id = req.session.user.a_id;
  }

  // get organization data
  let orgFound;
  try {
    orgFound = await organizationData.getOrganizationPageData(req.params.o_id, currentUser_id);
  } catch(e) {
    res.status(404).render('error', {
      title: "Error",
      ecode: 404,
      error: e
    });
    return
  }

  // only render this page if the current user is the organization's admin
  if (currentUser_id === orgFound.adminAccount){
    res.render('organizationDeletion', {
      title: 'Delete Organization',
      organization: orgFound,
      o_id:req.params.o_id,
    });
  } else {
    res.status(400).render('error', {
      title: "Error",
      ecode: 400,
      error: 'Cannot delete an organization you are not the admin of'
    });
  }
});


router.route('/organizations/:o_id/edit').get(async (req, res) => {
  // validate o_id
  try {
    req.params.o_id = await id_validation.checkOrganizationID(req.params.o_id);
  } catch (e) {
    res.status(400).render('error', {
      title: "Error",
      ecode: 400,
      error: e
    });
    return;
  }

  // get all known tags
  let knownTags;
  try {
    knownTags = await knownTagsData.getKnownTags();
  } catch (e) {
    res.status(500).render('error', {
      title: "Error",
      ecode: 500,
      error: e
    });
    return;
  }

  // get organization data
  let orgFound;
  try {
    orgFound = await organizationData.getOrganizationEditInfo(req.params.o_id);
  } catch(e) {
    res.status(404).render('error', {
      title: "Error",
      ecode: 404,
      error: e
    });
    return
  }

  // only show the page if the current user is the organization admin
  if (req.session.user && req.session.user.a_id === orgFound.adminAccount) {
    res.render('editOrg', {
      title: 'Edit Organization',
      knownTags: knownTags,
      orgTags: orgFound.tags,
      organization: orgFound,
      o_id: req.params.o_id,
      script_partial: 'editOrg_script'
    });
  } else {
    // otherwise show an error
    res.status(400).render('error', {
      title: "Error",
      ecode: 400,
      error: 'Cannot edit an organization you are not the admin of'
    });
  }
});


router.route('/createOrg').get(async (req, res) => {
  // get all known tags
  let knownTags;
  try {
    knownTags = await knownTagsData.getKnownTags();
  } catch (e) {
    res.status(500).render('error', {
      title: "Error",
      ecode: 500,
      error: e
    });
    return;
  }
  
  res.render('createOrg', {
    title: 'Create an organization',
    knownTags: knownTags,
    script_partial: 'createOrg_script'
  });
});


export default router;