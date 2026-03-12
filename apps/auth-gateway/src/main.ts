import './style.css';
import { AuthClient } from '@monorepo/auth-client';
import { Role } from '@monorepo/types';

// Configuration
const API_BASE_URL = 'http://localhost:3000';
const USER_APP_URL = 'http://localhost:3002'; // React User App
const ADMIN_APP_URL = 'http://localhost:3003'; // Angular Admin App

// Initialize auth client
const authClient = new AuthClient(API_BASE_URL);

// DOM Elements
const form = document.getElementById('login-form') as HTMLFormElement;
const usernameInput = document.getElementById('username') as HTMLInputElement;
const passwordInput = document.getElementById('password') as HTMLInputElement;
const loginButton = document.getElementById('login-button') as HTMLButtonElement;
const errorMessage = document.getElementById('error-message') as HTMLDivElement;

// Show error message
function showError(message: string) {
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
}

// Hide error message
function hideError() {
  errorMessage.style.display = 'none';
}

// Show success message and redirect
function showSuccessAndRedirect(role: Role, redirectUrl: string) {
  // Create success message
  const successDiv = document.createElement('div');
  successDiv.className = 'redirect-message';
  successDiv.textContent = `✓ Login successful! Redirecting to ${
    role === Role.ADMIN ? 'Admin' : 'User'
  } Portal...`;
  
  form.insertBefore(successDiv, errorMessage);
  
  // Redirect after 1.5 seconds
  setTimeout(() => {
    window.location.href = redirectUrl;
  }, 1500);
}

// Set loading state
function setLoading(loading: boolean) {
  loginButton.disabled = loading;
  if (loading) {
    loginButton.classList.add('loading');
    loginButton.textContent = 'Signing in';
  } else {
    loginButton.classList.remove('loading');
    loginButton.textContent = 'Sign In';
  }
}

// Handle form submission
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  hideError();
  setLoading(true);

  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  if (!username || !password) {
    showError('Please enter both username and password');
    setLoading(false);
    return;
  }

  try {
    // Authenticate with backend
    const response = await authClient.login({ username, password });

    console.log('Login successful:', { userId: response.userId, role: response.role });

    // Store token in own localStorage for "already logged in" detection on this page
    localStorage.setItem('authToken', response.token);
    localStorage.setItem('userId', response.userId);
    localStorage.setItem('userRole', response.role);

    // NOTE: localStorage is scoped per origin (port), so we pass the token via URL
    // query param so the target app can store it in its own localStorage.
    const appUrl = response.role === Role.ADMIN ? ADMIN_APP_URL : USER_APP_URL;
    const redirectUrl = `${appUrl}?token=${encodeURIComponent(response.token)}`;

    // Show success message and redirect
    showSuccessAndRedirect(response.role, redirectUrl);

  } catch (error) {
    console.error('Login failed:', error);
    
    if (error instanceof Error) {
      showError(error.message);
    } else {
      showError('Invalid credentials. Please try again.');
    }
    
    setLoading(false);
    
    // Clear password field
    passwordInput.value = '';
    passwordInput.focus();
  }
});

// Auto-focus username field on load
usernameInput.focus();

// If redirected here after logout, clear this origin's stored session first
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('logout') === 'true') {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userId');
  localStorage.removeItem('userRole');
  // Clean the URL
  window.history.replaceState({}, '', window.location.pathname);
}

// Check if user is already logged in
const existingToken = localStorage.getItem('authToken');
const existingRole = localStorage.getItem('userRole');

if (existingToken && existingRole) {
  console.log('User already logged in, checking session...');
  
  // Validate existing session
  authClient.getCurrentUser().then(user => {
    if (user) {
      console.log('Valid session found, redirecting...');
      const appUrl = user.role === Role.ADMIN ? ADMIN_APP_URL : USER_APP_URL;
      const token = localStorage.getItem('authToken') || '';
      const redirectUrl = `${appUrl}?token=${encodeURIComponent(token)}`;
      showSuccessAndRedirect(user.role, redirectUrl);
    }
  }).catch(() => {
    // Invalid session, clear storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
  });
}

console.log('🔐 Auth Gateway initialized');
console.log('API Base URL:', API_BASE_URL);
