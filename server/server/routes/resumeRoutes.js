const express = require('express');
const router = express.Router();
const multer = require('multer');
const { analyzeResume, getMyResumes } = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/analyze', protect, upload.single('resume'), analyzeResume);
router.get('/my-analyses', protect, getMyResumes);

module.exports = router;
