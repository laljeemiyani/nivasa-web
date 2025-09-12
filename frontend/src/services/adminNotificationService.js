import { adminAPI } from './api';

export const adminNotificationAPI = {
  /**
   * Create a notification for a specific resident
   * @param {Object} data - Notification data
   * @param {string} data.userId - User ID of the resident
   * @param {string} data.title - Notification title
   * @param {string} data.message - Notification message
   * @param {string} data.type - Notification type (info, success, warning, error)
   * @param {string} [data.relatedModel] - Related model name
   * @param {string} [data.relatedId] - Related model ID
   * @returns {Promise<Object>} - Response data
   */
  createForResident: (data) => {
    return adminAPI.post('/notifications/resident', data);
  },

  /**
   * Create a notification for all residents
   * @param {Object} data - Notification data
   * @param {string} data.title - Notification title
   * @param {string} data.message - Notification message
   * @param {string} data.type - Notification type (info, success, warning, error)
   * @returns {Promise<Object>} - Response data
   */
  createForAllResidents: (data) => {
    return adminAPI.post('/notifications/all', data);
  },
};