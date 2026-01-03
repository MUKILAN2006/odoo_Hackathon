import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

// Create axios instance with base URL and common headers
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000, // 10 seconds timeout
});

// Add request interceptor to include auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data || '');
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for consistent error handling
api.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.config.url}`, response.data);
    return response; // Return the full response object
  },
  (error) => {
    console.error('[API Response Error]', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    // Handle network errors
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timeout. Please check your internet connection.'));
    }
    
    // Handle server errors
    if (error.response) {
      const { status, data } = error.response;
      let errorMessage = data?.message || 'An error occurred';
      
      if (status === 401) {
        // Handle unauthorized access
        localStorage.removeItem('token');
        window.location.href = '/login';
        errorMessage = 'Your session has expired. Please log in again.';
      }
      
      return Promise.reject(new Error(errorMessage));
    }
    
    // Handle server errors
    if (error.response) {
      const { status, data } = error.response;
      let errorMessage = 'An error occurred';
      
      if (data?.error) {
        errorMessage = data.error;
      } else if (data?.message) {
        errorMessage = data.message;
      } else if (status === 401) {
        errorMessage = 'Please log in to continue';
      } else if (status === 403) {
        errorMessage = 'You do not have permission to perform this action';
      } else if (status === 404) {
        errorMessage = 'The requested resource was not found';
      } else if (status >= 500) {
        errorMessage = 'A server error occurred. Please try again later.';
      }
      
      return Promise.reject(new Error(errorMessage));
    }
    
    return Promise.reject(error);
  }
);

// Test API connection
export const testApiConnection = async () => {
  try {
    const response = await api.get('/health');
    console.log('API Connection Test:', response);
    return response;
  } catch (error) {
    console.error('API Connection Test Failed:', error);
    throw error;
  }
};

// Authentication API calls
export const authApi = {
  login: async (email, password) => {
    try {
      const response = await api.post('/users/login', { email, password });
      return response.data;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  },

  signup: async (name, email, password) => {
    try {
      const response = await api.post('/users/signup', { name, email, password });
      return response.data;
    } catch (error) {
      console.error('Error during signup:', error);
      throw error;
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return response.data.user;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/users/profile', profileData);
      return response.data.user;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  updateAvatar: async (file) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await api.put('/users/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      return response.data.user;
    } catch (error) {
      console.error('Error updating avatar:', error);
      throw error;
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.put('/users/password', {
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }
};

// Trip API calls
export const tripApi = {
  createTrip: async (tripData) => {
    try {
      const isFormData = tripData instanceof FormData;
      const response = await api.post('/trips', tripData, {
        headers: isFormData ? {
          'Content-Type': 'multipart/form-data',
        } : {
          'Content-Type': 'application/json',
        }
      });
      return response;
    } catch (error) {
      console.error('Error creating trip:', error);
      throw error;
    }
  },
  
  getTripsByUser: async (userId) => {
    try {
      console.log('Fetching trips for user:', userId);
      const response = await api.get(`/trips/${userId}`);
      
      console.log('API Response:', response);
      console.log('Response data:', response.data);
      
      if (response.data.success === false) {
        throw new Error(response.data.error || 'Failed to fetch trips');
      }
      
      console.log('Returning trips:', response.data.data);
      return response.data.data;
    } catch (error) {
      console.error('Error in getTripsByUser:', error);
      console.error('Error response:', error.response);
      throw error;
    }
  },

  updateTrip: async (tripId, tripData) => {
    try {
      const isFormData = tripData instanceof FormData;
      const response = await api.put(`/trips/${tripId}`, tripData, {
        headers: isFormData ? {
          'Content-Type': 'multipart/form-data',
        } : {
          'Content-Type': 'application/json',
        }
      });
      return response;
    } catch (error) {
      console.error('Error updating trip:', error);
      throw error;
    }
  },

  deleteTrip: async (tripId) => {
    try {
      const response = await api.delete(`/trips/${tripId}`);
      return response;
    } catch (error) {
      console.error('Error deleting trip:', error);
      throw error;
    }
  },

  // Stops API
  createStop: async (stopData) => {
    try {
      const response = await api.post('/stops', stopData);
      return response;
    } catch (error) {
      console.error('Error creating stop:', error);
      throw error;
    }
  },

  getStopsByTrip: async (tripId) => {
    try {
      const response = await api.get(`/stops/trip/${tripId}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching stops:', error);
      throw error;
    }
  },

  updateStop: async (stopId, stopData) => {
    try {
      const response = await api.put(`/stops/${stopId}`, stopData);
      return response;
    } catch (error) {
      console.error('Error updating stop:', error);
      throw error;
    }
  },

  deleteStop: async (stopId) => {
    try {
      const response = await api.delete(`/stops/${stopId}`);
      return response;
    } catch (error) {
      console.error('Error deleting stop:', error);
      throw error;
    }
  },

  // Activities API
  createActivity: async (activityData) => {
    try {
      const response = await api.post('/activities', activityData);
      return response;
    } catch (error) {
      console.error('Error creating activity:', error);
      throw error;
    }
  },

  getActivitiesByStop: async (stopId) => {
    try {
      const response = await api.get(`/activities/stop/${stopId}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching activities:', error);
      throw error;
    }
  },

  updateActivity: async (activityId, activityData) => {
    try {
      const response = await api.put(`/activities/${activityId}`, activityData);
      return response;
    } catch (error) {
      console.error('Error updating activity:', error);
      throw error;
    }
  },

  deleteActivity: async (activityId) => {
    try {
      const response = await api.delete(`/activities/${activityId}`);
      return response;
    } catch (error) {
      console.error('Error deleting activity:', error);
      throw error;
    }
  },

  // Activity Log API
  getActivitiesByUser: async (userId, limit = 10) => {
    try {
      const response = await api.get(`/activity-log/user/${userId}?limit=${limit}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching activities:', error);
      throw error;
    }
  },

  logActivity: async (userId, action, details) => {
    try {
      const response = await api.post('/activity-log/log', {
        userId,
        action,
        details
      });
      return response.data.data;
    } catch (error) {
      console.error('Error logging activity:', error);
      throw error;
    }
  },
};

export default api;
