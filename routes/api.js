import { Router } from 'express'
const router = Router();

router.route('/session-data').get(async (req, res) => {
  if (req.session.user) {
    res.json(req.session.user)
  } else {
    res.json(false);
  }
});

router.route('/users/login').post(async (req, res) => {
  //TODO: Need DB functions
  let email = req.body.email;
  let password = req.body.password;

  // validate inputs

  // call db function 

  // set session user
  // set local user_name variable
  // ex. 
  // req.session.user = {a_id: '6734f46960512626d9f23016'};
  // res.locals.user_name =  `${firstName} ${lastName}`;

  // redirect to root
  
  res.send(req.body);
})

router.route('/users/register').post(async (req, res) => {
  //TODO: replace with saving entry to database
  res.send(req.body)
})

router.route('/users').patch(async (req, res) => {
  //TODO: replace with saving entry to database
  res.send(req.body)
})

router.route('/search').post(async (req, res) => {
  res.send(req.body);
});

router.route('/organizations/:o_id/comment').post(async (req, res) => {
  //TODO Replace with saving comment to database
  res.send(req.body);
});

router.route('/organizations/:o_id/review').post(async (req, res) => {
  //TODO Replace with saving review to database
  res.send(req.body);
});

router.route('/account/edit').post(async (req, res) => {
  // TODO update account db based on new info
  res.send("IMPLEMENT ME");
});

router.route('/users').delete(async (req, res) =>{
  //TODO Delete the account by a_id of the currently logged in user
  res.send("Account Deleted!")
});

router.route('/organizations/:o_id').delete(async (req, res) =>{
  //TODO Delete the organization by o_id of the currently logged in user
  res.send(`Organization ${req.params.o_id} Deleted!`)
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