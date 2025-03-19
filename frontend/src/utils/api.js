// This file contains configuration for API endpoints
// Used to easily switch between development and production environments

const API_BASE_URL = 'happy-cafe-happy-team-production.up.railway.app/api';

export const API_ENDPOINTS = {
  // Menu endpoints
  MENUS: `${API_BASE_URL}/menus`,
  MENU_BY_DAY_WEEK: (day, week) => `${API_BASE_URL}/menus/${day}/${week}`,
  MENUS_BY_WEEK: (week) => `${API_BASE_URL}/menus/week/${week}`,
  
  // Order endpoints
  ORDERS: `${API_BASE_URL}/orders`,
  ORDERS_BY_STATUS: (status) => `${API_BASE_URL}/orders/status/${status}`,
  ORDER_STATUS: (id) => `${API_BASE_URL}/orders/${id}/status`,
  
  // Suggestion endpoints
  SUGGESTIONS: `${API_BASE_URL}/suggestions`,
  SUGGESTION_STATUS: (id) => `${API_BASE_URL}/suggestions/${id}/status`,
};
