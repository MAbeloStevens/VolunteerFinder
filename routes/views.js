import express from 'express'
const router = express.Router();


router.route('/').get(async (req, res) => {
  res.render('landing', {
    title: '',
    script_partial: 'landing_script'
  })
});


router.route('/login').get(async (req, res) => {
  res.render('login', {
    title: 'Log in',
    script_partial: 'login_script',
  })
})


router.route('/register').get(async (req, res) => {
  res.render('register', {
    title: 'Register an account',
    script_partial: 'register_script'
  })
})


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
    title: 'Welcome ...',
    script_partial: 'account_script',
    user: dummyUser
  })
})


export default router