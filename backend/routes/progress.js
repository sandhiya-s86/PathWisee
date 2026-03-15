const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const ctrl = require('../controllers/progressController');

router.post('/update',       authenticate, ctrl.updateProgress);
router.get('/:user_id',      authenticate, ctrl.getProgress);

module.exports = router;
