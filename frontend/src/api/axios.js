import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Add JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);

// Users
export const getUsers = () => API.get('/users');
export const deleteUser = (id) => API.delete(`/users/${id}`);

// Job Offers
export const getJobOffers = () => API.get('/job-offers');
export const getJobOffer = (id) => API.get(`/job-offers/${id}`);
export const searchJobOffers = (params) => API.get('/job-offers/search', { params });
export const createJobOffer = (data) => API.post('/job-offers', data);
export const updateJobOffer = (id, data) => API.put(`/job-offers/${id}`, data);
export const deleteJobOffer = (id) => API.delete(`/job-offers/${id}`);
export const getRecruiterJobOffers = (id) => API.get(`/job-offers/recruiter/${id}`);

// Applications
export const applyToJob = (data) => API.post('/applications', data);
export const getMyApplications = () => API.get('/applications/my-applications');
export const getApplicationsByJobOffer = (id) => API.get(`/applications/job-offer/${id}`);
export const getRecruiterApplications = () => API.get('/applications/recruiter');
export const updateApplicationStatus = (id, data) => API.put(`/applications/${id}/status`, data);

// Documents
export const uploadDocument = (formData) =>
  API.post('/files/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const getMyDocuments = () => API.get('/files/my-documents');
export const downloadDocument = (id) => API.get(`/files/download/${id}`, { responseType: 'blob' });
export const deleteDocument = (id) => API.delete(`/files/${id}`);

// Interviews
export const createInterview = (data) => API.post('/interviews', data);
export const getMyInterviews = () => API.get('/interviews/my-interviews');
export const getRecruiterInterviews = () => API.get('/interviews/recruiter');
export const getInterviewsByApplication = (id) => API.get(`/interviews/application/${id}`);
export const updateInterview = (id, data) => API.put(`/interviews/${id}`, data);
export const deleteInterview = (id) => API.delete(`/interviews/${id}`);

// Notifications
export const getNotifications = () => API.get('/notifications');
export const getUnread = () => API.get('/notifications/unread');
export const getUnreadCount = () => API.get('/notifications/unread-count');
export const markAsRead = (id) => API.put(`/notifications/${id}/read`);
export const markAllAsRead = () => API.put('/notifications/read-all');

// Dashboard
export const getDashboardStats = () => API.get('/dashboard/stats');

export default API;
