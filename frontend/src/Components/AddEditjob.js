import React, { useState, useEffect } from 'react';
import { FiBriefcase, FiMapPin, FiTag, FiType, FiSave, FiEdit2 } from 'react-icons/fi';

const AddEditJob = ({ onSubmit, editingJob, onCancel }) => {
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    job_type: '',
    tags: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingJob) {
      setForm({ 
        ...editingJob, 
        tags: editingJob.tags.join(', ') 
      });
    } else {
      setForm({
        title: '',
        company: '',
        location: '',
        job_type: '',
        tags: ''
      });
    }
    setErrors({});
  }, [editingJob]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Job title is required';
    if (!form.company.trim()) newErrors.company = 'Company name is required';
    if (!form.location.trim()) newErrors.location = 'Location is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!validateForm()) return;

    const jobData = {
      ...form,
      tags: form.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    onSubmit(jobData);
    if (!editingJob) {
      setForm({ title: '', company: '', location: '', job_type: '', tags: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="job-form">
      <div className="form-group">
        <label htmlFor="title">
          <FiBriefcase className="icon" /> Job Title
        </label>
        <input
          id="title"
          name="title"
          placeholder="e.g. Senior Actuary"
          value={form.title}
          onChange={handleChange}
          className={errors.title ? 'error' : ''}
        />
        {errors.title && <span className="error-message">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="company">
          <FiBriefcase className="icon" /> Company
        </label>
        <input
          id="company"
          name="company"
          placeholder="e.g. Guardian Life"
          value={form.company}
          onChange={handleChange}
          className={errors.company ? 'error' : ''}
        />
        {errors.company && <span className="error-message">{errors.company}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="location">
          <FiMapPin className="icon" /> Location
        </label>
        <input
          id="location"
          name="location"
          placeholder="e.g. New York, NY or Remote"
          value={form.location}
          onChange={handleChange}
          className={errors.location ? 'error' : ''}
        />
        {errors.location && <span className="error-message">{errors.location}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="job_type">
          <FiType className="icon" /> Job Type
        </label>
        <select
          id="job_type"
          name="job_type"
          value={form.job_type}
          onChange={handleChange}
        >
          <option value="">Select Job Type</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
          <option value="Internship">Internship</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="tags">
          <FiTag className="icon" /> Tags (comma separated)
        </label>
        <input
          id="tags"
          name="tags"
          placeholder="e.g. Life Insurance, ASA, Python"
          value={form.tags}
          onChange={handleChange}
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="primary">
          {editingJob ? (
            <>
              <FiEdit2 className="icon" /> Update Job
            </>
          ) : (
            <>
              <FiSave className="icon" /> Add Job
            </>
          )}
        </button>
        {editingJob && (
          <button type="button" onClick={onCancel} className="danger">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default AddEditJob;