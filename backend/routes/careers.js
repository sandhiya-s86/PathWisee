const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const ctrl   = require('../controllers/careersController');
const skills = require('../controllers/skillsController');

router.get('/',                       ctrl.getCareers);
router.get('/:career_id',             ctrl.getCareer);
router.get('/:career_id/roadmap',     ctrl.getCareerRoadmap);
router.get('/:career_id/exams',       ctrl.getCareerExams);
router.get('/:career_id/colleges',    ctrl.getCareerColleges);
router.get('/:career_id/skills',      authenticate, skills.getCareerSkills);

module.exports = router;
