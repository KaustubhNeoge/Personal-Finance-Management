import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const Profile = () => {
  const { currentUser, updateProfile, error } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validatePassword = () => {
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    if (formData.newPassword && formData.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword && !validatePassword()) {
      return;
    }
    
    setIsSubmitting(true);
    setSuccessMessage('');
    
    try {
      const userData = {
        name: formData.name,
        email: formData.email
      };
      
      if (formData.currentPassword && formData.newPassword) {
        userData.currentPassword = formData.currentPassword;
        userData.newPassword = formData.newPassword;
      }
      
      await updateProfile(userData);
      setSuccessMessage('Profile updated successfully');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (err) {
      console.error('Profile update failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="profile">
      <h2>Profile Settings</h2>
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <h3>Change Password</h3>
        <div className="form-group">
          <label htmlFor="currentPassword">Current Password</label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {passwordError && <div className="error-message">{passwordError}</div>}
        </div>
        
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default Profile;