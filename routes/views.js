import express from 'express'
const router = express.Router();


router.route('/').get(async (req, res) => {
  res.render('landing', {
    title: 'Volunteer Finder'
  })
});


//sign in //render the page
router.route('/login').get(async (req, res) => {
  res.render('login', {
    title: 'Log in'
  })
})


//sign up
router.route('/register').get(async (req, res) => {
  res.render('register', {
    title: 'Register an account'
  })
})


//account
router.route('/account/:id').get(async (req, res) => { 
  //Instructions: Routing for account page given a_id?

  //Function that takes in id returns account information?
  //req.params.id

  //res.render('getaccount' {
  //title: `Welcome ${name}`,
  // ?
  //})
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