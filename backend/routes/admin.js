const router = require('express').Router();
const { authenticate, requireAdmin } = require('../middleware/auth');
const ctrl = require('../controllers/adminController');

router.use(authenticate, requireAdmin);   // all admin routes require auth + admin

router.get('/users',                 ctrl.getAllUsers);
router.post('/career/create',        ctrl.createCareer);
router.delete('/career/:career_id',  ctrl.deleteCareer);

module.exports = router;
