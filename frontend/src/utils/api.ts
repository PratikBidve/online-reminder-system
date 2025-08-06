/**
 * API utility for Online Reminder System frontend
 * Handles requests to Express backend and JWT token management
 */
const API_BASE = 'http://localhost:4000/api';

export const getToken = () => localStorage.getItem('token');
export const setToken = (token: string) => localStorage.setItem('token', token);
export const clearToken = () => localStorage.removeItem('token');

export const signup = async (email: string, password: string, name: string) => {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name })
  });
  return res.json();
};

export const login = async (email: string, password: string) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res.json();
};

export const fetchReminders = async () => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/reminders`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
};

export const createReminder = async (title: string, description: string, remindAt: string) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/reminders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ title, description, remindAt })
  });
  return res.json();
};

export const deleteReminder = async (id: string) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/reminders/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
};
