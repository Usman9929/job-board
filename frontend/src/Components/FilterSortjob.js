import React, { useEffect, useState } from 'react';
import { FiSearch, FiFilter, FiCalendar } from 'react-icons/fi';
import axios from 'axios';

const FilterSortJob = ({ filters, setFilters, sort, setSort }) => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:5000/jobs");
        const jobs = res.data;

        // Extract unique locations
        const uniqueLocations = [...new Set(jobs.map(job => job.location).filter(Boolean))];
        setLocations(uniqueLocations);
      } catch (err) {
        console.error("❌ Failed to fetch job locations:", err);
      }
    };

    fetchLocations();
  }, []);

  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  const clearFilters = () => {
    setFilters({ search: '', job_type: '', location: '' });
    setSort('posting_date_desc');
  };

  return (
    <div className="filter-container">
      <div className="filter-header">
        <FiFilter className="filter-icon" />
        <h3>Filter & Sort Jobs</h3>
        <button
          onClick={clearFilters}
          className="clear-filters"
          disabled={!filters.search && !filters.job_type && !filters.location && sort === 'posting_date_desc'}
        >
          Clear All
        </button>
      </div>

      <div className="filter-grid">
        <div className="filter-group">
          <label htmlFor="search">
            <FiSearch className="input-icon" /> Search
          </label>
          <input
            id="search"
            name="search"
            placeholder="Title, company, or keywords"
            value={filters.search}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="job_type">Job Type</label>
          <select
            id="job_type"
            name="job_type"
            value={filters.job_type}
            onChange={handleFilterChange}
          >
            <option value="">All Job Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="location">Location</label>
          <select
            id="location"
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
          >
            <option value="">All Locations</option>
            {locations.map((loc, index) => (
              <option key={index} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sort">
            <FiCalendar className="input-icon" /> Sort By
          </label>
          <select
            id="sort"
            value={sort}
            onChange={handleSortChange}
          >
            <option value="posting_date_desc">Newest First</option>
            <option value="posting_date_asc">Oldest First</option>
            <option value="title_asc">Title (A-Z)</option>
            <option value="title_desc">Title (Z-A)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterSortJob;
