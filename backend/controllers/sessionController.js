const Session = require('../models/Session');
const User = require('../models/User');

const createSession = async (req, res) => {
  try {
    const { learnerId, teacherId, skill, duration, scheduledTime, notes } = req.body;

    if (learnerId === teacherId) {
      return res.status(400).json({ message: "You cannot book a session with yourself, dude!" });
    }
    const learner = await User.findById(learnerId);
    if (!learner) {
      return res.status(404).json({ message: 'Learner not found' });
    }
    if (learner.timeBalance < duration) {
      return res.status(400).json({ message: 'Not enough time in your wallet to book this session!' });
    }
    learner.timeBalance -= duration;
    learner.pendingBalance += duration;
    await learner.save(); 
    const session = await Session.create({
      learner: learnerId,
      teacher: teacherId,
      skill,
      duration,
      scheduledTime,
      notes,
    });

    res.status(201).json({ 
      message: 'Session requested! Time placed in escrow.', 
      session 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while creating session' });
  }
};

const updateSessionStatus = async (req, res) => {
  try {
    const { status } = req.body; 
    const { id } = req.params;   
    const session = await Session.findById(id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    if (['completed', 'canceled', 'rejected'].includes(session.status)) {
      return res.status(400).json({ message: `Cannot update. Session is already ${session.status}.` });
    }
    const learner = await User.findById(session.learner);
    const teacher = await User.findById(session.teacher);
    if (status === 'accepted') {
      session.status = 'accepted';
      session.meetingLink = `https://meet.jit.si/TimeBank_${session._id}`;
      await session.save();
      return res.status(200).json({ message: 'Session accepted! Meeting link generated. Ready to learn.', session });
    }
    if (status === 'completed') {
      learner.pendingBalance -= session.duration;
      teacher.timeBalance += session.duration;
      teacher.totalSessionsCompleted += 1; 

      session.status = 'completed';
      await learner.save();
      await teacher.save();
      await session.save();

      return res.status(200).json({ message: 'Session completed! Time transferred to teacher.', session });
    }
    if (status === 'rejected' || status === 'canceled') {
      learner.pendingBalance -= session.duration;
      learner.timeBalance += session.duration;

      session.status = status;

      await learner.save();
      await session.save();

      return res.status(200).json({ message: `Session ${status}. Time fully refunded.`, session });
    }
    res.status(400).json({ message: 'Invalid status update' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating session' });
  }
};

const getUserSessions = async (req, res) => {
  try {
    const { userId } = req.params;
    const sessions = await Session.find({
      $or: [{ learner: userId }, { teacher: userId }]
    })
    .populate('learner', 'name email profilePicture') 
    .populate('teacher', 'name email profilePicture') 
    .sort({ scheduledTime: -1 }); 

    res.status(200).json({
      message: 'Sessions fetched successfully',
      count: sessions.length,
      sessions,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching sessions' });
  }
}; 

const addReview = async (req, res) => {
  try {
    const { rating, reviewText } = req.body;
    const { id } = req.params; 

    const session = await Session.findById(id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    if (session.status !== 'completed') {
      return res.status(400).json({ message: 'You can only review completed sessions.' });
    }

    if (session.learner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the learner can leave a review.' });
    }
    if (session.rating) {
      return res.status(400).json({ message: 'You have already reviewed this session.' });
    }

    session.rating = rating;
    session.reviewText = reviewText;
    await session.save();

    const allTeacherSessions = await Session.find({
      teacher: session.teacher,
      rating: { $exists: true }
    });
    const totalStars = allTeacherSessions.reduce((acc, curr) => acc + curr.rating, 0);
    const newAverageRating = totalStars / allTeacherSessions.length;
    const teacher = await User.findById(session.teacher);
    teacher.rating = Math.round(newAverageRating * 10) / 10; 
    await teacher.save();

    res.status(200).json({ message: 'Review added successfully!', session, newTeacherRating: teacher.rating });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while adding review' });
  }
};

module.exports = { createSession, updateSessionStatus, getUserSessions, addReview };



