const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { 
    type: String, 
    enum: ['submitted', 'resume_viewed', 'shortlisted', 'interview_scheduled', 'rejected'], 
    default: 'submitted' 
  },
  appliedAt: { type: Date, default: Date.now },
  interviewDetails: {
    date: Date,
    time: String,
    location: String,
    notes: String
  },
  statusHistory: [{
    status: String,
    changedAt: { type: Date, default: Date.now },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }]
});

module.exports = mongoose.model('Application', applicationSchema);
