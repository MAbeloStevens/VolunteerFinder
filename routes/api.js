import {Router} from 'express'
const router = Router();

router.route('/users/register').post(async (req, res) => {
  //TODO: replace with saving entry to database
  res.send(req.body)
})

router.route('/search').post(async (req, res) =>{
  res.send(req.body);
});

export default router