const router = require('express').Router();
const ctrl = require('../controllers/collegesController');

router.get('/',              ctrl.getColleges);
router.get('/:college_id',   ctrl.getCollege);

module.exports = router;
