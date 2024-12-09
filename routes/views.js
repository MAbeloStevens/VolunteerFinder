import { Router } from 'express'
const router = Router();

import validation from '../helpers/validation.js';
import id_validation from '../helpers/id_validation.js';
import { accountData, organizationData, commentData, reviewData, knownTagsData } from '../data/index.js';


router.route('/').get(async (req, res) => {
  //testing constructed recommendedOrgs mostInterestedOrgs
  let recommendedOrgs = [
    {
      o_id: '123' ,
      name: 'Org1',
      tags: ["Afterschool Programs", "Assisting People with Disabilities"],
      interestCount: 51
    }
  ];
  let mostInterestedOrgs = [
    {
      o_id: '123' ,
      name: 'Org1',
      tags: ["Afterschool Programs", "Assisting People with Disabilities"],
      interestCount: 13
    },
    {
      o_id: '321' ,
      name: 'Org2',
      tags: ["Blood Donation Drives", "Clothing Drives"],
      interestCount: 12
    }
  ];
  // REMOVE WHEN DB FUNCTIONS ARE READY /\/\/\

  if(!req.session.user) {
    // if not logged in, render default landing page
    res.render('landing', {
      title: '',
      mostInterestedOrgs: mostInterestedOrgs
    });
  } else {
    // get user data
    // let userData = await accountData.getAccountDisplayData(res.session.user.a_id);
    // get user recommended orgs
    // let recommendedOrgs = await organizationData.getOrganizationsTags(await organizationData.getRecommendedOrgs(userData.tags));
    // get most interested orgs
    // let mostInterestedOrgs = await organizationData.getOrganizationsTags(await organizationData.getMostInterestedOrgs());
    
    res.render('landing', {
      title: '',
      recommendedOrgs: recommendedOrgs,
      mostInterestedOrgs: mostInterestedOrgs
    });
  }
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
  //TODO: replace dummy with currently logged in user
  //TODO: Remember to populate organizations
  const dummyUser = {
    "a_id": '6734f46960512626d9f23016',
    "firstName": 'Mark',
    "lastName": 'Abelo',
    "passwordHash": 'b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86',
    "tags": ['Animals', 'Children', 'Elderly'],
    "interestedOrgs": [
      {
        "o_id": "6734f61c5f097d890337fc69",
        "name": "Care For Cats"
      },
      {
        "o_id": '6734f61c5f097d890337fc6d',
        "name": "Care For Dogs"
      }

    ],
    "organizations": [
      {
        "o_id": '6734f61c5f097d890337fc66',
        "name": "Care For Birds"
      }
    ],
    "email": 'myemail@mail.com',
    "phone": '123-456-7890',
  }

  // get id of currently logged in user from authentication system.
  // Validate Id -> trade for user
  res.render('account', {
    title: `${dummyUser.firstName} ${dummyUser.lastName}`,
    owner: true,
    user: dummyUser
  })
})


router.route('/account/edit').get(async (req, res) => {
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
  // TODO: swap out for db call
  const dummyUser = {
    "a_id": '6734f46960512626d9f23016',
    "firstName": 'Mark',
    "lastName": 'Abelo',
    "tags": ['Animals', 'Children', 'Elderly'],
    "phone": '123-456-7890',
  }

  res.render('editAccount', {
    title: 'Edit Account',
    user: dummyUser,
    knownTags: knownTags,
    userTags: dummyUser.tags,
    script_partial: 'editAccount_script'
  });
});


router.route('/account/delete').get(async (req, res) => {
  res.render('accountDeletion', {
    title: 'Delete Account'
  });
});


router.route('/account/accountPage/:a_id').get(async (req, res) => {
  // validate a_id
  try {
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


router.route('/organizations/:o_id').get(async (req, res) => {
  let currentUser_id = undefined;
  if (req.session.user) {
    currentUser_id = req.session.user.a_id;
  }
  // TODO implement comment and review display
  // validate o_id
  try {
    req.params.o_id = await id_validation.checkOrganizationID(req.params.o_id);
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
    const orgFound = await organizationData.getOrganizationPageData(req.params.o_id);
    if (!orgFound) {
      res.status(404).render('error', {
        title: "Error",
        ecode: 404,
        error: "Organization not found"
      });
      return
    }

    // render page
    if (req.session.user && req.session.user.a_id === orgFound.adminAccount) {
      // if the current user is the owner of this organization
      res.render('organization', {
        title: orgFound.name,
        o_id: req.params.o_id,
        orgData: orgFound,
        owner: true
      });
    }
    res.render('organization', {
      title: orgFound.name,
      o_id: req.params.o_id,
      orgData: orgFound,
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
  //TODO swap out for organization from database
  const dummyOrganization = {
    "o_id": '6734f61c5f097d890337fc6b',
    "name": 'Care For Cats'
  }
  res.render('createComment', {
    title: 'Post a comment',
    organization: dummyOrganization,
    script_partial: 'createComment_script'
  });
});


router.route('/organizations/:o_id/review').get(async (req, res) => {
  //TODO swap out for organization from database
  const dummyOrganization = {
    "o_id": '6734f61c5f097d890337fc6b',
    "name": 'Care For Cats'
  }
  res.render('createReview', {
    title: 'Leave a Review',
    organization: dummyOrganization,
    script_partial: 'createReview_script'
  });
});


router.route('/organizations/:o_id/delete').get(async (req, res) => {
  // validate parameter
  
  // get projection {o_id, name}
  const dummyOrganization = {
    "o_id": '6734f61c5f097d890337fc6b',
    "name": 'Care For Cats'
  }
  res.render('organizationDeletion', {
    title: 'Delete Organization',
    organization: dummyOrganization
  });
});


router.route('/organizations/:o_id/edit').get(async (req, res) => {
  // validate parameter
  
  // get projection {o_id, name}
  const dummyOrganization = {
    "o_id": '6734f61c5f097d890337fc6b',
    "name": 'Care For Cats'
  }
  res.render('editOrg', {
    title: 'Edit Organization',
    organization: dummyOrganization,
    script_partial: 'editOrg_script'
  });
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
    script_partial: 'createOrg_script',
    knownTags: knownTags
  });
});


router.route('/orgAdmin').get(async (req, res) => {
  try {
    // get user's organization list
    // let user_organizations = await accountData.getAccountOrganizations(req.session.user.a_id);

    // call getOrganizationsInterest
    // let ownedOrgs = organizationData.getOrganizationsInterest(user_organizations);

    // for all organizations in the list, map interestedAccounts to be the projection returned by getAccountNames
    // ownedOrgs = ownedOrgs.map(async (org) => {
    //   org.interestedAccounts = await accountData.getAccountNames(org.interestedAccounts);
    //   return org;
    // });

    // testing:
    let paulDini = {
      a_id: '6734f61c5f097d890337fc65',
      firstName: 'Paul',
      lastName: 'Dini'
    };
    let kConroy = {
      a_id: '6734f61c5f097d890337fc64',
      firstName: 'Kevin',
      lastName: 'Conroy'
    };
    let ownedOrgs = [
      {
        o_id: '6734f61c5f097d890337fc66',
        name: "Care For Birds",
        interestedAccounts: [
          paulDini,
          kConroy,
          kConroy,
          kConroy,
          kConroy,
          kConroy
        ],
        interestCount: 6
      },
      {
        o_id: '675543ec0ea783c261bebd49',
        name: "Care For Reptiles",
        interestedAccounts: [],
        interestCount: 0
      }
    ];

    if (ownedOrgs.length == 0) {
      ownedOrgs = undefined
    }
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


export default router;