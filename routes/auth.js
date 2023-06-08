const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/index');
const { login , sendEmail} = require('../controllers/auth');

const router = Router();

router.post('/login',[
    check('email', 'Email is required').isEmail(),
    check('password', 'Password is required').not().isEmpty(),
    validateFields
],login );


router.post('/send',[
], sendEmail );



module.exports = router;