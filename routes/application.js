const { Router } = require('express');
const router = Router();


const { listApplications , updateApplications} = require('../controllers/applications');



router.get('/', listApplications );
router.put('/', updateApplications );


module.exports = router;