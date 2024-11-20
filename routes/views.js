
import express from 'express'

const router = express.Router();

router.route('/').get(async (req, res) => {

  res.render('landing', {
    title: 'Volunteer Finder'
  })

});

export default router