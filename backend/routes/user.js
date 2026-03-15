const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const ctrl = require('../controllers/skillsController');

// POST /api/user/skills/add?skill_name=...
router.post('/skills/add', authenticate, ctrl.addUserSkill);

module.exports = router;
