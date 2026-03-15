const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const ctrl = require('../controllers/assessmentController');

router.get('/questions',            ctrl.getQuestions);
router.post('/submit',              authenticate, ctrl.submitAssessment);
router.get('/results/:user_id',     authenticate, ctrl.getResults);

module.exports = router;
