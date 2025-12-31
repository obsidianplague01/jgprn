// src/utils/api.js
import axios from 'axios';
import { logger } from './logger';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const API_TIMEOUT = 30000;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    logger.error('API Request Error', { error: error.message });
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
    logger.error('API Response Error', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: errorMessage,
    });
    return Promise.reject(error);
  }
);

export const subscribeNewsletter = async (email) => {
  try {
    const response = await apiClient.post('/newsletter/subscribe', { email });
    logger.info('Newsletter subscription successful', { email });
    return response.data;
  } catch (error) {
    logger.error('Newsletter subscription failed', { 
      email, 
      error: error.message 
    });
    throw new Error(
      error.response?.data?.message || 'Failed to subscribe. Please try again.'
    );
  }
};

export const submitContactForm = async (formData) => {
  try {
    const response = await apiClient.post('/contact/submit', formData);
    logger.info('Contact form submitted successfully', { 
      email: formData.email 
    });
    return response.data;
  } catch (error) {
    logger.error('Contact form submission failed', { 
      email: formData.email, 
      error: error.message 
    });
    throw new Error(
      error.response?.data?.message || 'Failed to send message. Please try again.'
    );
  }
};

export const submitPayment = async (paymentData) => {
  try {
    const formData = new FormData();
    formData.append('receipt', paymentData.receipt);
    formData.append('orderDetails', JSON.stringify(paymentData.orderDetails));
    formData.append('grandTotal', paymentData.grandTotal);
    formData.append('summary', paymentData.summary);

    const response = await apiClient.post('/payments/submit-manual', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    logger.info('Payment submitted successfully', {
      totalAmount: paymentData.grandTotal,
    });
    return response.data;
  } catch (error) {
    logger.error('Payment submission failed', {
      totalAmount: paymentData.grandTotal,
      error: error.message,
    });
    throw new Error(
      error.response?.data?.message || 'Failed to submit payment. Please try again.'
    );
  }
};

export default apiClient;