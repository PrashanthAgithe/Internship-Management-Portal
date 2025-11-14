const express = require('express');
const { signup, signin, getUser, uploadDocuments , getAllStudents, updateDocumentStatus} = require('../controllers/userController');
const { authMiddleware, requireRole } = require("../middlewares/userMiddleware");
const router = express.Router();

// Route for user signup
router.post('/signup', signup);

// Route for user signin
router.post('/signin', signin);

router.get('/get',authMiddleware,getUser)

router.post("/uploadDocs", authMiddleware, requireRole("student"), uploadDocuments);

router.get(
    "/students",
    authMiddleware,
    requireRole("teacher"),   // only teachers allowed
    getAllStudents
);

router.patch(
    "/approve/:studentId/:docType",
    authMiddleware,
    requireRole("teacher"),
    updateDocumentStatus
);

module.exports = router;