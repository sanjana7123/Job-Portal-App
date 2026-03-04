import React, { useState, useEffect } from 'react';
import api from '../api/axios';

function Profile() {
  const [profile, setProfile] = useState({
    phone: '',
    location: '',
    bio: '',
    education: [],
    experience: [],
    skills: [],
    certifications: []
  });
  const [editing, setEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/profile');
      if (data.profile) {
        setProfile(data.profile);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const handleSave = async () => {
    try {
      await api.put('/profile', { profile });
      setEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      alert('Failed to update profile');
    }
  };

  const addEducation = () => {
    setProfile({
      ...profile,
      education: [...profile.education, { degree: '', institution: '', year: '' }]
    });
  };

  const updateEducation = (index, field, value) => {
    const updated = [...profile.education];
    updated[index][field] = value;
    setProfile({ ...profile, education: updated });
  };

  const removeEducation = (index) => {
    setProfile({
      ...profile,
      education: profile.education.filter((_, i) => i !== index)
    });
  };

  const addExperience = () => {
    setProfile({
      ...profile,
      experience: [...profile.experience, { title: '', company: '', duration: '', description: '' }]
    });
  };

  const updateExperience = (index, field, value) => {
    const updated = [...profile.experience];
    updated[index][field] = value;
    setProfile({ ...profile, experience: updated });
  };

  const removeExperience = (index) => {
    setProfile({
      ...profile,
      experience: profile.experience.filter((_, i) => i !== index)
    });
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (index) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter((_, i) => i !== index)
    });
  };

  const addCertification = () => {
    setProfile({
      ...profile,
      certifications: [...profile.certifications, { name: '', issuer: '', year: '' }]
    });
  };

  const updateCertification = (index, field, value) => {
    const updated = [...profile.certifications];
    updated[index][field] = value;
    setProfile({ ...profile, certifications: updated });
  };

  const removeCertification = (index) => {
    setProfile({
      ...profile,
      certifications: profile.certifications.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="container">
      <div className="card">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
          <h2>My Profile</h2>
          {!editing ? (
            <button onClick={() => setEditing(true)} className="btn btn-primary">
              Edit Profile
            </button>
          ) : (
            <div className="btn-group">
              <button onClick={handleSave} className="btn btn-success">
                Save Changes
              </button>
              <button onClick={() => setEditing(false)} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="profile-section">
          <h3>Personal Information</h3>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile({...profile, phone: e.target.value})}
              disabled={!editing}
            />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              value={profile.location}
              onChange={(e) => setProfile({...profile, location: e.target.value})}
              disabled={!editing}
            />
          </div>
          <div className="form-group">
            <label>Bio</label>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile({...profile, bio: e.target.value})}
              disabled={!editing}
              rows="4"
            />
          </div>
        </div>

        <div className="profile-section">
          <h3>Education</h3>
          {profile.education.map((edu, index) => (
            <div key={index} className="profile-item">
              <div className="form-group">
                <label>Degree</label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                  disabled={!editing}
                />
              </div>
              <div className="form-group">
                <label>Institution</label>
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                  disabled={!editing}
                />
              </div>
              <div className="form-group">
                <label>Year</label>
                <input
                  type="text"
                  value={edu.year}
                  onChange={(e) => updateEducation(index, 'year', e.target.value)}
                  disabled={!editing}
                />
              </div>
              {editing && (
                <button onClick={() => removeEducation(index)} className="btn btn-danger">
                  Remove
                </button>
              )}
            </div>
          ))}
          {editing && (
            <button onClick={addEducation} className="btn btn-secondary">
              + Add Education
            </button>
          )}
        </div>

        <div className="profile-section">
          <h3>Experience</h3>
          {profile.experience.map((exp, index) => (
            <div key={index} className="profile-item">
              <div className="form-group">
                <label>Job Title</label>
                <input
                  type="text"
                  value={exp.title}
                  onChange={(e) => updateExperience(index, 'title', e.target.value)}
                  disabled={!editing}
                />
              </div>
              <div className="form-group">
                <label>Company</label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => updateExperience(index, 'company', e.target.value)}
                  disabled={!editing}
                />
              </div>
              <div className="form-group">
                <label>Duration</label>
                <input
                  type="text"
                  value={exp.duration}
                  onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                  disabled={!editing}
                  placeholder="e.g., Jan 2020 - Dec 2022"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={exp.description}
                  onChange={(e) => updateExperience(index, 'description', e.target.value)}
                  disabled={!editing}
                  rows="3"
                />
              </div>
              {editing && (
                <button onClick={() => removeExperience(index)} className="btn btn-danger">
                  Remove
                </button>
              )}
            </div>
          ))}
          {editing && (
            <button onClick={addExperience} className="btn btn-secondary">
              + Add Experience
            </button>
          )}
        </div>

        <div className="profile-section">
          <h3>Skills</h3>
          <div>
            {profile.skills.map((skill, index) => (
              <span key={index} className="skill-tag">
                {skill}
                {editing && (
                  <span 
                    onClick={() => removeSkill(index)} 
                    style={{marginLeft: '8px', cursor: 'pointer', fontWeight: 'bold'}}
                  >
                    ×
                  </span>
                )}
              </span>
            ))}
          </div>
          {editing && (
            <div style={{marginTop: '15px', display: 'flex', gap: '10px'}}>
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                placeholder="Add a skill"
                style={{flex: 1}}
              />
              <button onClick={addSkill} className="btn btn-secondary">
                Add
              </button>
            </div>
          )}
        </div>

        <div className="profile-section">
          <h3>Certifications</h3>
          {profile.certifications.map((cert, index) => (
            <div key={index} className="profile-item">
              <div className="form-group">
                <label>Certification Name</label>
                <input
                  type="text"
                  value={cert.name}
                  onChange={(e) => updateCertification(index, 'name', e.target.value)}
                  disabled={!editing}
                />
              </div>
              <div className="form-group">
                <label>Issuer</label>
                <input
                  type="text"
                  value={cert.issuer}
                  onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                  disabled={!editing}
                />
              </div>
              <div className="form-group">
                <label>Year</label>
                <input
                  type="text"
                  value={cert.year}
                  onChange={(e) => updateCertification(index, 'year', e.target.value)}
                  disabled={!editing}
                />
              </div>
              {editing && (
                <button onClick={() => removeCertification(index)} className="btn btn-danger">
                  Remove
                </button>
              )}
            </div>
          ))}
          {editing && (
            <button onClick={addCertification} className="btn btn-secondary">
              + Add Certification
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
