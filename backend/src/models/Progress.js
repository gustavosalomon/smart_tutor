const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subjectId: {
    type: String,
    required: true
  },
  subjectName: {
    type: String,
    required: true
  },
  currentUnit: {
    type: Number,
    default: 1
  },
  completedUnits: [{
    unitId: Number,
    completedAt: Date
  }],
  completedLessons: [{
    unitId: Number,
    lessonIndex: Number,
    completedAt: Date
  }],
  exercises: [{
    unitId: Number,
    question: String,
    answer: String,
    isCorrect: Boolean,
    attemptedAt: Date
  }],
  quizScores: [{
    unitId: Number,
    score: Number,
    totalQuestions: Number,
    percentage: Number,
    attemptedAt: {
      type: Date,
      default: Date.now
    }
  }],
  lastAccessed: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Progress', ProgressSchema);
