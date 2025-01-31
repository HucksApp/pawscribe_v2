/**
 * API Service using Axios
 *
 * This module sets up an Axios instance for making API calls, including
 * handling authentication tokens, request and response interception, and
 * request cancellation.
 *
 * @module api
 */

import axios from 'axios';
import Cache from '../store/cache';
import Notify from './notification';

// Fallback BASE_URL
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

console.info(`Using BASE_URL: ${BASE_URL}`);

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 20000, // Default timeout
  headers: {
    'Content-Type': 'application/json', // Set default Content-Type
  },
});

// Refresh token logic
const refreshToken = async () => {
  const cachedTokens = Cache.getWithExpiry('pawscribe_tokens');
const refreshToken = cachedTokens?.refreshToken;

if (!refreshToken) {
  throw new Error('No refresh token available');
}
  try {
    const response = await axios.post(`${BASE_URL}/auth/refresh-token`, {
      refreshToken,
    });
    const { accessToken, refreshToken: newRefreshToken } = response.data.tokens;
    Cache.setWithExpiry('pawscribe_tokens', { accessToken, refreshToken: newRefreshToken });
    return accessToken;
  } catch (error) {
    console.error('[Token Refresh Error]:', error);
  }
};

/**
 * Add a function to set up default query parameters
 */
const defaultQueryParams = () => {
  return {
    lang: navigator.language || 'en-US', // Example: include user's locale
  };
};

/**
 * Request Interceptor
 *
 * Adds Authorization token and default query parameters to each request.
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const tokens = Cache.getWithExpiry('pawscribe_tokens');
    const accessToken = tokens ? tokens.accessToken : null;
    
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    Notify({
      title: 'Request Failed',
      message: error.response?.data?.message || error.message,
      type: 'error',
    });
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 *
 * Logs and handles response errors based on status codes.
 */
axiosInstance.interceptors.response.use(
  (response) => response, // Pass successful responses
  async (error) => {
    if (error.response) {
      const status = error.response.status;
      const errorMessage = error.response?.data?.message || error.message;

      // Handle specific errors
      switch (status) {
        case 401: // Unauthorized
          if (error.response?.data?.code === 'TOKEN_EXPIRED') {
            try {
              const newAccessToken = await refreshToken();
              if (newAccessToken) {
                error.config.headers.Authorization = `Bearer ${newAccessToken}`;
                return axiosInstance.request(error.config); // Retry the failed request
              }
            } catch (refreshError) {
              Notify({
                title: 'Session Expired',
                message: 'Please log in again to continue.',
                type: 'info',
              });
            }
          } else {
            Notify({
              title: 'Unauthorized',
              message: errorMessage || 'Your session has expired or credentials are invalid.',
              type: 'warn',
            });
          }
          break;

        case 403: // Forbidden
          Notify({
            title: 'Access Denied',
            message: 'You do not have permission to access this resource.',
            type: 'error',
          });
          break;

        case 404: // Not Found
          Notify({
            title: 'Resource Not Found',
            message: errorMessage || 'The requested resource could not be found.',
            type: 'error',
          });
          break;

        case 500: // Internal Server Error
          Notify({
            title: 'Server Error',
            message: 'An internal server error occurred. Please try again later.',
            type: 'error',
          });
          break;

        default:
          Notify({
            title: 'Unexpected Error',
            message: errorMessage || 'An unexpected error occurred.',
            type: 'error',
          });
      }
    } else if (error.request) {
      // Network or no response error
      Notify({
        title: 'Network Error',
        message: 'Failed to connect to the server. Please check your network connection.',
        type: 'error',
      });
    } else {
      // General client-side or Axios-related error
      Notify({
        title: 'Error',
        message: error.message || 'An error occurred. Please try again.',
        type: 'error',
      });
    }

    // Stop further processing after notifying the user
    return Promise.reject(error);
  }
);

/**
 * Request Cancellation Support
 */
export const createCancelableRequest = () => {
  const controller = new AbortController();
  return {
    cancelToken: controller.signal,
    cancel: () => controller.abort(),
  };
};

/**
 * Utility Methods for API Requests with async/await
 */
export const api = {
  get: async (url, params = {}, config = {}) => {
    const cancelable = createCancelableRequest();
    try {
      const response = await axiosInstance.get(url, {
        ...config,
        params,
        signal: cancelable.cancelToken,
      });
      return response.data; // Return only the data
    } catch (error) {
      console.error('[API GET Error]:', error);
      throw error;
    }
  },

  post: async (url, data = {}, config = {}) => {
    const cancelable = createCancelableRequest();
    try {
      const response = await axiosInstance.post(url, data, {
        ...config,
        signal: cancelable.cancelToken,
      });
      console.log("now here",response.data)
      return response.data;
    } catch (error) {
      console.error('[API POST Error]:', error);
      throw error;
    }
  },

  put: async (url, data = {}, config = {}) => {
    const cancelable = createCancelableRequest();
    try {
      const response = await axiosInstance.put(url, data, {
        ...config,
        signal: cancelable.cancelToken,
      });
      return response.data;
    } catch (error) {
      console.error('[API PUT Error]:', error);
      throw error;
    }
  },

  delete: async (url, config = {}) => {
    const cancelable = createCancelableRequest();
    try {
      const response = await axiosInstance.delete(url, {
        ...config,
        signal: cancelable.cancelToken,
      });
      return response.data;
    } catch (error) {
      console.error('[API DELETE Error]:', error);
      throw error;
    }
  },
};

/**
 * Export the Axios instance
 */
export default axiosInstance;


