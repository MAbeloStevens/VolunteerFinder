import {Router} from 'express';

const router = Router();

router.route('/').get(async (req, res) => {
    res.render('home', {
        pageTitle: 'Volunteer Finder Homepage',
        script_partial: 'home_script'
    });
});



//export router
export default router;