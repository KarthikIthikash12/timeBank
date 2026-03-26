const express = require('express');
const { createSession, updateSessionStatus, getUserSessions, addReview} = require('../controllers/sessionController');
const { protect } = require('../middleware/authMiddleware'); 

const router = express.Router();

router.post('/', protect, createSession);
router.put('/:id/status', protect, updateSessionStatus); 
router.get('/user/:userId',protect, getUserSessions); 
router.post('/:id/review', protect, addReview); 

module.exports = router;