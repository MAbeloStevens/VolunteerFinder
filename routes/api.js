import express from 'express'
const router = express.Router();

router.route('/users/register').post(async (req, res) => {
  //TODO: replace with saving entry to database
  res.send(req.body)
})

router.route('/users').patch(async (req, res) => {
  //TODO: replace with saving entry to database
  res.send(req.body)
})

export default router