import { Router } from 'express'
const router = Router();

router.route('/session-data').get(async (req, res) => {
  if (req.session.user) {
    res.json(req.session.user)
  } else {
    res.json(false);
  }
});
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
      res.redirect('/');
    }
  });
});

export default router;