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
  // TODO: swap out for list from database
  const knownTags = ["Afterschool Programs", "Assisting People with Disabilities", "Blood Donation Drives", "Clothing Drives"]
  res.render('register', {
    title: 'Register an account',
    script_partial: 'register_script',
    knownTags: knownTags
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


export default router