const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'recruiter'], required: true },
  profile: {
    phone: { type: String },
    location: { type: String },
    bio: { type: String },
    education: [{
      degree: String,
      institution: String,
      year: String
    }],
    experience: [{
      title: String,
      company: String,
      duration: String,
      description: String
    }],
    skills: [{ type: String }],
    certifications: [{
      name: String,
      issuer: String,
      year: String
    }],
    resume: { type: String }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
