// This file contains utility functions for making API requests
// Used to standardize API calls across the application

import { API_ENDPOINTS } from './api';

// Generic fetch function with error handling
async function fetchAPI(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

// Menu API functions
export const menuService = {
  getAllMenus: () => fetchAPI(API_ENDPOINTS.MENUS),
  getMenuByDayAndWeek: (day, week) => fetchAPI(API_ENDPOINTS.MENU_BY_DAY_WEEK(day, week)),
  getMenusByWeek: (week) => fetchAPI(API_ENDPOINTS.MENUS_BY_WEEK(week)),
  createOrUpdateMenu: (menuData) => fetchAPI(API_ENDPOINTS.MENUS, {
    method: 'POST',
    body: JSON.stringify(menuData),
  }),
  deleteMenu: (id) => fetchAPI(`${API_ENDPOINTS.MENUS}/${id}`, {
    method: 'DELETE',
  }),
};

// Order API functions
export const orderService = {
  getAllOrders: () => fetchAPI(API_ENDPOINTS.ORDERS),
  getOrdersByStatus: (status) => fetchAPI(API_ENDPOINTS.ORDERS_BY_STATUS(status)),
  createOrder: (orderData) => fetchAPI(API_ENDPOINTS.ORDERS, {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),
  updateOrderStatus: (id, status) => fetchAPI(API_ENDPOINTS.ORDER_STATUS(id), {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),
};

// Suggestion API functions
export const suggestionService = {
  getAllSuggestions: () => fetchAPI(API_ENDPOINTS.SUGGESTIONS),
  createSuggestion: (suggestionData) => fetchAPI(API_ENDPOINTS.SUGGESTIONS, {
    method: 'POST',
    body: JSON.stringify(suggestionData),
  }),
  updateSuggestionStatus: (id, status) => fetchAPI(API_ENDPOINTS.SUGGESTION_STATUS(id), {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),
};
