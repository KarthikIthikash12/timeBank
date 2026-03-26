const User = require('../models/User');
const Transaction = require('../models/Transaction'); 

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      skillsOffered: user.skillsOffered,
      timeBalance: user.timeBalance,
      sessionDuration: user.sessionDuration, 
      availableSlots: user.availableSlots,   
      sessionTitle: user.sessionTitle, 
      topics: user.topics,     
      category: user.category,
      profilePicture: user.profilePicture   
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.name = req.body.name || user.name;
    user.bio = req.body.bio || user.bio;

    if (req.body.skillsOffered) {
      user.skillsOffered = typeof req.body.skillsOffered === 'string' 
        ? req.body.skillsOffered.split(',').map(skill => skill.trim()) 
        : req.body.skillsOffered;
    }
    if (req.body.sessionDuration) user.sessionDuration = req.body.sessionDuration;
    if (req.body.availableSlots) user.availableSlots = req.body.availableSlots;
    if (req.body.sessionTitle !== undefined) user.sessionTitle = req.body.sessionTitle;
    if (req.body.topics !== undefined) user.topics = req.body.topics;
    if (req.body.category !== undefined) user.category = req.body.category;

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      bio: updatedUser.bio,
      skillsOffered: updatedUser.skillsOffered,
      timeBalance: updatedUser.timeBalance,
      profilePicture: user.profilePicture, 
      sessionDuration: updatedUser.sessionDuration, 
      availableSlots: updatedUser.availableSlots,   
      sessionTitle: updatedUser.sessionTitle, 
      topics: updatedUser.topics,     
      category: updatedUser.category         
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image file' });
    }
    const imageUrl = req.file.path;
    const user = await User.findById(req.user.id || req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.profilePicture = imageUrl;
    await user.save();

    res.status(200).json({
      message: 'Profile picture uploaded successfully!',
      profilePicture: user.profilePicture,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        timeBalance: user.timeBalance
      }
    });

  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    res.status(500).json({ message: 'Server error during upload' });
  }
};

const getTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ "skillsOffered.0": { $exists: true } })
      .select('-password -resetPasswordToken -resetPasswordExpire -email');

    res.status(200).json({
      message: 'Teachers fetched successfully',
      count: teachers.length,
      teachers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching teachers' });
  }
};
const bookSession = async (req, res) => {
  try {
    const { teacherId, duration, scheduledDate } = req.body;
    
    if (!scheduledDate) return res.status(400).json({ message: 'You must select a time slot!' });

    const buyer = await User.findById(req.user._id);
    const seller = await User.findById(teacherId);

    if (!seller) return res.status(404).json({ message: 'Teacher not found' });
    if (buyer._id.toString() === seller._id.toString()) return res.status(400).json({ message: 'You cannot book yourself!' });

    if (buyer.timeBalance === undefined) buyer.timeBalance = 120;
    if (seller.timeBalance === undefined) seller.timeBalance = 120;

    if (buyer.timeBalance < duration) {
      return res.status(400).json({ message: 'Not enough time balance.' });
    }
    const conflict = await Transaction.findOne({
      $or: [
        { sender: buyer._id }, 
        { receiver: buyer._id },
        { sender: seller._id }, 
        { receiver: seller._id }
      ],
      scheduledDate: scheduledDate,
      status: { $in: ['pending', 'approved'] } 
    });

    if (conflict) {
      return res.status(400).json({ message: `Temporal conflict! That time slot is already booked.` });
    }
    buyer.timeBalance -= duration;
    await buyer.save();
 
    const tradedSkill = seller.skillsOffered && seller.skillsOffered.length > 0 
      ? `${seller.skillsOffered[0]} Session` 
      : '1-on-1 Mentorship';

    await Transaction.create({
      sender: buyer._id,
      receiver: seller._id,
      amount: duration,
      reason: tradedSkill,
      scheduledDate: scheduledDate 
    });

    res.status(200).json({ message: 'Booking successful!', newBalance: buyer.timeBalance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during transaction' });
  }
};

const depositTime = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.timeBalance = (user.timeBalance || 0) + 120;
    await user.save();

    res.status(200).json({ 
      message: 'Time deposited successfully!', 
      newBalance: user.timeBalance 
    });
  } catch (error) {
    console.error("Deposit error:", error);
    res.status(500).json({ message: 'Server error during deposit' });
  }
};

const getTransactions = async (req, res) => {
  try {
    const userId = req.user._id;
    const currentUser = await User.findById(userId);

    const transactions = await Transaction.find({
      $or: [{ sender: userId }, { receiver: userId }]
    })
    .populate('sender', 'name email')
    .populate('receiver', 'name email')
    .sort({ createdAt: -1 }); 

    const formattedHistory = transactions.map(tx => {
      const isSender = tx.sender._id.toString() === userId.toString();
      return {
        _id: tx._id,
        type: isSender ? 'spent' : 'earned',
        amount: tx.amount,
        counterparty: isSender ? (tx.receiver.name || tx.receiver.email) : (tx.sender.name || tx.sender.email),
        skill: tx.reason,
        date: tx.createdAt,
        scheduledDate: tx.scheduledDate,
        isReviewed: tx.isReviewed,
        ratingGiven: tx.ratingGiven,
        status: tx.status 
      };
    });
    res.status(200).json({ 
      balance: currentUser.timeBalance, 
      history: formattedHistory 
    });
  } catch (error) {
    console.error("Ledger error:", error);
    res.status(500).json({ message: 'Server error fetching ledger' });
  }
};

const leaveReview = async (req, res) => {
  try {
    const { transactionId, rating } = req.body;
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) return res.status(404).json({ message: 'Session not found' });
    if (transaction.isReviewed) return res.status(400).json({ message: 'You already reviewed this session!' });

    if (transaction.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to review this session' });
    }

    transaction.isReviewed = true;
    transaction.ratingGiven = rating;
    await transaction.save();

    const teacher = await User.findById(transaction.receiver);

    const currentTotalScore = teacher.averageRating * teacher.reviewCount;
    const newReviewCount = teacher.reviewCount + 1;
    const newAverage = (currentTotalScore + rating) / newReviewCount;
    teacher.averageRating = Math.round(newAverage * 10) / 10;
    teacher.reviewCount = newReviewCount;
    await teacher.save();

    res.status(200).json({ message: 'Review submitted successfully!', newRating: teacher.averageRating });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error submitting review' });
  }
};

const updateSessionStatus = async (req, res) => {
  try {
    const { status } = req.body; 
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) return res.status(404).json({ message: 'Session not found in database' });
    const userId = req.user._id.toString();
    const isStudent = transaction.sender.toString() === userId;
    const isTeacher = transaction.receiver.toString() === userId;

    if (status === 'approved' && !isTeacher) {
      return res.status(403).json({ message: 'Only the teacher can approve this session.' });
    }
    if (status === 'completed' && !isStudent) {
      return res.status(403).json({ message: 'Only the student can release the Escrow funds!' });
    }
    if (status === 'cancelled' && !isStudent && !isTeacher) {
      return res.status(403).json({ message: 'Not authorized to cancel this session.' });
    }
    if (status === 'cancelled' && transaction.status !== 'cancelled') {
      const buyer = await User.findById(transaction.sender);
      if (buyer) {
        buyer.timeBalance += transaction.amount; 
        await buyer.save();
      }
    }

    if (status === 'completed' && transaction.status === 'approved') {
      const seller = await User.findById(transaction.receiver);
      if (seller) {
        seller.timeBalance += transaction.amount;
        await seller.save();
      }
    }

    transaction.status = status;
    await transaction.save();

    res.status(200).json({ message: `Session ${status} successfully!` });
  } catch (error) {
    console.error("SESSION UPDATE CRASH:", error); 
    res.status(500).json({ message: 'Error updating status', error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching user profile' });
  }
};

module.exports = { updateUserProfile, getUserProfile, getTeachers, uploadProfilePicture, bookSession, depositTime, getTransactions, leaveReview, updateSessionStatus, uploadProfilePicture, getUserById};