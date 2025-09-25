import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests if available
apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authAPI = {
    login: (credentials) => apiClient.post('/auth/login', credentials),
    register: (userData) => apiClient.post('/auth/register', userData),
    logout: () => apiClient.post('/auth/logout'),
    getProfile: () => apiClient.get('/auth/profile'),
    forgotPassword: (email) => apiClient.post('/auth/forgot-password', {email}),
    resetPassword: (token, password) => apiClient.post('/auth/reset-password', {token, password}),
};

export const adminAPI = {
    getDashboardStats: () => apiClient.get('/admin/dashboard/stats'),
    getResidents: (params) => apiClient.get('/admin/residents', {params}),
    updateResidentStatus: (userId, data) => apiClient.put(`/admin/residents/${userId}/status`, data),
    getComplaints: (params) => apiClient.get('/admin/complaints', {params}),
    updateComplaintStatus: (complaintId, data) => apiClient.put(`/admin/complaints/${complaintId}/status`, data),
    deleteComplaint: (complaintId) => apiClient.delete(`/admin/complaints/${complaintId}`),
    getNotices: (params) => apiClient.get('/notices/admin', {params}),
    createNotice: (data) => apiClient.post('/notices/admin', data),
    updateNotice: (noticeId, data) => apiClient.put(`/notices/admin/${noticeId}`, data),
    deleteNotice: (noticeId) => apiClient.delete(`/notices/admin/${noticeId}`),
    getVehicles: (params) => apiClient.get('/admin/vehicles', {params}),
    updateVehicleStatus: (vehicleId, data) => apiClient.put(`/admin/vehicles/${vehicleId}/status`, data)
};

export const residentAPI = {
    getProfile: () => apiClient.get('/auth/profile'),
    updateProfile: (data) => apiClient.put('/auth/profile', data),
    updateProfilePhoto: (formData) => apiClient.post('/auth/update-profile-photo', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }),
    changePassword: (data) => apiClient.post('/auth/change-password', data),
    getNotices: (params) => apiClient.get('/notices', {params}),
    getComplaints: (params) => apiClient.get('/complaints', {params}),
    createComplaint: (data) => apiClient.post('/complaints', data),
    updateComplaint: (complaintId, data) => apiClient.put(`/complaints/${complaintId}`, data),
    deleteComplaint: (complaintId) => apiClient.delete(`/complaints/${complaintId}`),
    getFamilyMembers: () => apiClient.get('/family'),
    addFamilyMember: (data) => apiClient.post('/family', data),
    updateFamilyMember: (memberId, data) => apiClient.put(`/family/${memberId}`, data),
    deleteFamilyMember: (memberId) => apiClient.delete(`/family/${memberId}`),
    getVehicles: () => apiClient.get('/vehicles/my-vehicles'),
    addVehicle: (data) => apiClient.post('/vehicles', data),
    updateVehicle: (vehicleId, data) => apiClient.put(`/vehicles/${vehicleId}`, data),
    deleteVehicle: (vehicleId) => apiClient.delete(`/vehicles/${vehicleId}`)
};
