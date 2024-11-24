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
  // get id of currently logged in user from authentication system.
  // Validate Id -> trade for user
  res.render('account', {
    title: 'Welcome ...',
    script_partial: 'account_script'
    // user: user
  })
})


router.route('/orgizationAdministration').get(async (req, res) => {
})


router.route('/createOrganization').get(async (req, res) => {
})


router.route('/organization').get(async (req, res) => {
})


//search what? organization? people?
router.route('/search').get(async (req, res) => {
  //req.body.searchByTitle

  //res.status.()

  //res.render('', {page information})
})

router.route('/editProfile').get(async (req, res) => {
})


router.route('/editOrganization').get(async (req, res) => {
})

//Look into what comment creation purpose/meaning
router.route('/commentCreation').get(async (req, res) => {
})


router.route('/reviews').get(async (req, res) => {
})


router.route('/deleteAccount').get(async (req, res) => {
})


router.route('/delete Organization').get(async (req, res) => {
})


//? So just the landing page? But not logged in?
router.route('/notLoggedIn').get(async (req, res) => {
})


router.route('/miscErrors').get(async (req, res) => {
})

export default router