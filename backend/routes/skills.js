const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const ctrl = require('../controllers/skillsController');

router.get('/', ctrl.getAllSkills);

module.exports = router;
