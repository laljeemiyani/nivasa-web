import { apiClient } from './api';

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
