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

export const notificationAPI = {
  // Get all notifications for the current user
  getNotifications: (params) => apiClient.get('/notifications', { params }),
  
  // Mark a notification as read
  markAsRead: (notificationId) => apiClient.put(`/notifications/${notificationId}/read`),
  
  // Mark all notifications as read
  markAllAsRead: () => apiClient.put('/notifications/mark-all-read'),
  
  // Delete a notification
  deleteNotification: (notificationId) => apiClient.delete(`/notifications/${notificationId}`),
  
  // Get unread notification count
  getUnreadCount: () => apiClient.get('/notifications/unread-count')
};