const express = require('express');
const Application = require('../models/Application');
const Job = require('../models/Job');
const { auth, isRecruiter } = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { jobId } = req.body;
    
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const existingApplication = await Application.findOne({ 
      jobId, 
      userId: req.user.userId 
    });
    
    if (existingApplication) {
      return res.status(400).json({ message: 'Already applied to this job' });
    }

    const application = new Application({
      jobId,
      userId: req.user.userId
    });
    
    await application.save();
    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/my-applications', auth, async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user.userId })
      .populate('jobId')
      .sort({ appliedAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/job/:jobId', [auth, isRecruiter], async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    if (job.recruiterId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const applications = await Application.find({ jobId: req.params.jobId })
      .populate('userId')
      .sort({ appliedAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/:id/status', [auth, isRecruiter], async (req, res) => {
  try {
    const { status, interviewDetails } = req.body;
    const application = await Application.findById(req.params.id).populate('jobId');
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    if (application.jobId.recruiterId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Add to status history
    application.statusHistory.push({
      status: status,
      changedBy: req.user.userId,
      changedAt: new Date()
    });

    application.status = status;
    
    // If scheduling interview, save interview details
    if (status === 'interview_scheduled' && interviewDetails) {
      application.interviewDetails = interviewDetails;
    }
    
    await application.save();
    res.json(application);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all scheduled interviews for recruiter
router.get('/recruiter/interviews', [auth, isRecruiter], async (req, res) => {
  try {
    const jobs = await Job.find({ recruiterId: req.user.userId });
    const jobIds = jobs.map(job => job._id);
    
    const interviews = await Application.find({
      jobId: { $in: jobIds },
      status: 'interview_scheduled'
    })
      .populate('userId', 'name email profile')
      .populate('jobId', 'title company')
      .sort({ 'interviewDetails.date': 1 });
    
    res.json(interviews);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
