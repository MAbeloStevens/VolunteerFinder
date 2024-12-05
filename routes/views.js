import { Router } from 'express'
const router = Router();

import validation from '../helpers/validation.js';
import { organizationData, knownTagsData } from '../data/index.js';


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
    script_partial: 'account_script',
    user: dummyUser
  })
})

router.route('/search').get(async (req, res) => {
  // get all known tags
  let knownTags;
  try {
    // knownTags = await knownTagsData.getKnownTags();
    // knownTags = knownTags.tags;
    knownTags = ["Afterschool Programs", "Assisting People with Disabilities", "Blood Donation Drives", "Clothing Drives"];
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

router.route('/organizations/:id').get(async (req, res) => {
  // console.log(req.params.id)
  // validate o_id
  try {
    req.params.id = validation.checkID(req.params.id, 'organization id');
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
    const orgFound = await organizationData.getOrganizationPageData(req.params.id);
    if (!orgFound) {
      res.status(404).render('error', {
        title: "Error",
        ecode: 404,
        error: "organization not found"
      });
      return
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

router.route('/account/edit').get(async (req, res) => {
  // TODO: swap out for list from database
  const knownTags = ["Afterschool Programs", "Animals", "Assisting People with Disabilities", "Blood Donation Drives", "Clothing Drives"]
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
    knownTags: knownTags.map(elem => {
      return {
        label: elem,
        checked: dummyUser.tags.includes(elem) ? "checked" : ""
      }
    }),
    userTags: dummyUser.tags.filter(elem => {
      return !knownTags.includes(elem)
    })
  });
});

router.route('/account/delete').get(async (req, res) => {
  res.render('accountDeletion', {
    title: 'Delete Account'
  });
});

router.route('/organizations/:o_id/comment').get(async (req, res) => {
  //TODO swap out for organization from database
  const dummyOrganization = {
    "o_id" : '6734f61c5f097d890337fc6b',
    "name" : 'Care For Cats'
  }

  res.render('createComment', {
    title: 'Post a comment',
    organization : dummyOrganization
  });
});

export default router;