const router = require('express').Router();
const ctrl = require('../controllers/examsController');

router.get('/',          ctrl.getExams);
router.get('/:exam_id',  ctrl.getExam);

module.exports = router;
