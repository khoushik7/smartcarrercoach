const express = require('express');
const router = express.Router();
const { 
  getPlatformAnalytics, 
  getAllQuestions, 
  createQuestion, 
  updateQuestion, 
  deleteQuestion, 
  getAllUsers, 
  updateUserRole 
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/analytics', protect, adminOnly, getPlatformAnalytics);
router.get('/questions', protect, adminOnly, getAllQuestions);
router.post('/question', protect, adminOnly, createQuestion);
router.put('/question/:id', protect, adminOnly, updateQuestion);
router.delete('/question/:id', protect, adminOnly, deleteQuestion);
router.get('/users', protect, adminOnly, getAllUsers);
router.put('/user/:id/role', protect, adminOnly, updateUserRole);

module.exports = router;
