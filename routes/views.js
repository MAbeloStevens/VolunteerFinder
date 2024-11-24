import express from 'express'
const router = express.Router();


router.route('/').get(async (req, res) => {
  res.render('landing', {
    title: 'Volunteer Finder',
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


export default router