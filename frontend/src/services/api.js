import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
  verifyToken: () => api.get('/auth/verify'),
};

// Admin API
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  getResidents: (params) => api.get('/admin/residents', { params }),
  updateResidentStatus: (userId, statusData) => api.put(`/admin/residents/${userId}/status`, statusData),
  getComplaints: (params) => api.get('/admin/complaints', { params }),
  updateComplaintStatus: (complaintId, statusData) => api.put(`/admin/complaints/${complaintId}/status`, statusData),
  deleteComplaint: (complaintId) => api.delete(`/admin/complaints/${complaintId}`),
  getVehicles: (params) => api.get('/admin/vehicles', { params }),
};

// Notice API
export const noticeAPI = {
  getNotices: (params) => api.get('/notices', { params }),
  getNotice: (noticeId) => api.get(`/notices/${noticeId}`),
  createNotice: (noticeData) => api.post('/notices/admin', noticeData),
  updateNotice: (noticeId, noticeData) => api.put(`/notices/admin/${noticeId}`, noticeData),
  deleteNotice: (noticeId) => api.delete(`/notices/admin/${noticeId}`),
  getNoticeStats: () => api.get('/notices/admin/stats'),
};

// Complaint API
export const complaintAPI = {
  createComplaint: (complaintData) => api.post('/complaints', complaintData),
  getUserComplaints: (params) => api.get('/complaints/my-complaints', { params }),
  getComplaint: (complaintId) => api.get(`/complaints/${complaintId}`),
  updateComplaint: (complaintId, complaintData) => api.put(`/complaints/${complaintId}`, complaintData),
  deleteComplaint: (complaintId) => api.delete(`/complaints/${complaintId}`),
  getComplaintStats: () => api.get('/complaints/admin/stats'),
};

// Family API
export const familyAPI = {
  addFamilyMember: (memberData) => api.post('/family', memberData),
  getFamilyMembers: () => api.get('/family'),
  getFamilyMember: (memberId) => api.get(`/family/${memberId}`),
  updateFamilyMember: (memberId, memberData) => api.put(`/family/${memberId}`, memberData),
  deleteFamilyMember: (memberId) => api.delete(`/family/${memberId}`),
};

// Vehicle API
export const vehicleAPI = {
  addVehicle: (vehicleData) => api.post('/vehicles', vehicleData),
  getUserVehicles: () => api.get('/vehicles/my-vehicles'),
  getVehicle: (vehicleId) => api.get(`/vehicles/${vehicleId}`),
  updateVehicle: (vehicleId, vehicleData) => api.put(`/vehicles/${vehicleId}`, vehicleData),
  deleteVehicle: (vehicleId) => api.delete(`/vehicles/${vehicleId}`),
  getVehicleStats: () => api.get('/vehicles/admin/stats'),
};

// File upload API
export const uploadAPI = {
  uploadFile: (formData, endpoint) => {
    const token = localStorage.getItem('token');
    return axios.post(`${import.meta.env.VITE_API_URL || '/api'}/${endpoint}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
  },
};

export default api;
