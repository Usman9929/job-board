import axios from 'axios';

const API_URL = 'http://localhost:5000/jobs';

export const getJobs = (params) => axios.get(API_URL, { params });
export const createJob = (job) => axios.post(API_URL, job);
export const updateJob = (id, job) => axios.put(`${API_URL}/${id}`, job);
export const deleteJob = (id) => axios.delete(`${API_URL}/${id}`);
