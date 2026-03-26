const express = require('express');
const { updateUserProfile, getUserProfile , getTeachers, uploadProfilePicture, bookSession, depositTime, getTransactions, leaveReview, updateSessionStatus, getUserById} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary'); 


const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/teachers', getTeachers);
router.post('/book', protect, bookSession);
router.post('/deposit', protect, depositTime);
router.get('/ledger', protect, getTransactions);
router.post('/review', protect, leaveReview);
router.put('/session/:id/status', protect, updateSessionStatus);
router.post('/profile-picture', protect, upload.single('image'), uploadProfilePicture);
router.get('/:id', getUserById);

module.exports = router;