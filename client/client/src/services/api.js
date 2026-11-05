/**
 * Central API Client for Smart Career Coach
 */
const API_BASE = '/api';

export async function apiRequest(endpoint, method = 'GET', body = null, isFormData = false) {
  const token = localStorage.getItem('token');
  const headers = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = isFormData ? body : JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, options);

  let data;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch (e) {
      data = null;
    }
  } else {
    const text = await response.text();
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = { error: text || response.statusText };
    }
  }

  if (!response.ok) {
    const errorMsg = (data && data.error) 
      ? data.error 
      : `Server request failed with status ${response.status} (${response.statusText || 'Backend server may be offline'})`;
    throw new Error(errorMsg);
  }

  return data;
}
