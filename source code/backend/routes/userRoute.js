const express = require('express');
const { signup, signin, getUser } = require('../controllers/userController');
const authMiddleware = require('../middlewares/userMiddleware');
const router = express.Router();

// Route for user signup
router.post('/signup', signup);

// Route for user signin
router.post('/signin', signin);

router.get('/get',authMiddleware,getUser)

module.exports = router;