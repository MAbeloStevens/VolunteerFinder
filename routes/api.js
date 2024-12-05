import { Router } from 'express'
const router = Router();

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

export default router