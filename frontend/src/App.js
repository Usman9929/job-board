import React, { useState, useEffect, useCallback } from 'react';
import { FiMapPin, FiClock, FiEdit2 } from 'react-icons/fi'; // Added missing icon imports
import { getJobs, createJob, updateJob, deleteJob } from './api';
import AddEditJob from './Components/AddEditjob';
import DeleteJob from './Components/Deletejob';
import FilterSortJob from './Components/FilterSortjob';
import './App.css';

// Added formatDate utility function
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

function App() {
  const [jobs, setJobs] = useState([]);
  const [editingJob, setEditingJob] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    job_type: '',
    location: ''
  });
  const [sort, setSort] = useState('posting_date_desc');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllJobs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getJobs({ ...filters, sort });
      setJobs(res.data);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
      setError('Failed to load jobs. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [filters, sort]);

  useEffect(() => {
    fetchAllJobs();
  }, [fetchAllJobs]);

  const handleSubmit = async (jobData) => {
    try {
      if (editingJob) {
        await updateJob(editingJob.id, jobData);
        setEditingJob(null);
      } else {
        await createJob(jobData);
      }
      await fetchAllJobs();
    } catch (err) {
      console.error('Job submission failed:', err);
      setError(`Failed to ${editingJob ? 'update' : 'create'} job.`);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteJob(id);
      await fetchAllJobs();
    } catch (err) {
      console.error('Job deletion failed:', err);
      setError('Failed to delete job.');
    }
  };

  const handleCancelEdit = () => {
    setEditingJob(null);
  };

  return (
    <div className="App">
      <h1>Job Listings</h1>
      
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      <AddEditJob 
        onSubmit={handleSubmit} 
        editingJob={editingJob} 
        onCancel={handleCancelEdit}
      />
      
      <FilterSortJob 
        filters={filters} 
        setFilters={setFilters} 
        sort={sort} 
        setSort={setSort} 
      />

      {isLoading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading jobs...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="no-jobs">
          <p>No jobs found matching your criteria.</p>
          <button onClick={fetchAllJobs}>Reset Filters</button>
        </div>
      ) : (
        <div className="job-list">
          {jobs.map(job => (
            <div key={job.id} className="job-card">
              <div className="job-header">
                <h3>{job.title}</h3>
                <span className="job-type">{job.job_type}</span>
              </div>
              <p className="company">{job.company}</p>
              <div className="meta">
                <span>
                  <FiMapPin /> {job.location}
                </span>
                <span>
                  <FiClock /> Posted {formatDate(job.posting_date)}
                </span>
              </div>
              {job.tags && job.tags.length > 0 && (
                <div className="tags">
                  {job.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              )}
              <div className="job-actions">
                <button 
                  onClick={() => setEditingJob(job)}
                  className="edit-button"
                >
                  <FiEdit2 /> Edit
                </button>
                <DeleteJob jobId={job.id} onDelete={handleDelete} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;