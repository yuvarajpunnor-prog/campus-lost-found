/**
 * Central API Client and Utility Functions
 * Campus Lost & Found Portal
 */

const API_BASE = (window.location.port === '8080') 
  ? '/api' 
  : 'http://localhost:8080/api';

// -------------------------------------------------------------
// Authentication State Management
// -------------------------------------------------------------
function getAuthUser() {
  try {
    const raw = localStorage.getItem('campus_auth_user');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function setAuthUser(user) {
  localStorage.setItem('campus_auth_user', JSON.stringify(user));
}

function clearAuth() {
  localStorage.removeItem('campus_auth_user');
}

function requireAuth(redirectUrl = 'login.html') {
  const user = getAuthUser();
  if (!user) {
    showToast('Please log in to access this page.', 'warning');
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 1000);
    return null;
  }
  return user;
}

// -------------------------------------------------------------
// Universal API Request Helper
// -------------------------------------------------------------
async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const defaultHeaders = {
    'Accept': 'application/json'
  };

  if (!(options.body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {})
    }
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      let errMsg = 'Request failed with status ' + response.status;
      if (data && data.message) errMsg = data.message;
      else if (data && data.error) errMsg = data.error;
      throw new Error(errMsg);
    }

    return data;
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
}

// -------------------------------------------------------------
// Toast Notifications
// -------------------------------------------------------------
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `custom-toast ${type}`;

  let iconClass = 'fa-info-circle';
  if (type === 'success') iconClass = 'fa-check-circle text-success';
  else if (type === 'error') iconClass = 'fa-exclamation-triangle text-danger';
  else if (type === 'warning') iconClass = 'fa-exclamation-circle text-warning';

  toast.innerHTML = `
    <i class="fas ${iconClass} fs-5"></i>
    <div class="flex-grow-1" style="font-size: 0.92rem; font-weight: 500;">${message}</div>
    <button type="button" class="btn-close btn-close-sm" aria-label="Close" onclick="this.parentElement.remove()"></button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.transition = 'all 0.3s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }
  }, 4500);
}

// -------------------------------------------------------------
// Format Dates & Badges
// -------------------------------------------------------------
function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch (e) {
    return dateStr;
  }
}

function getStatusBadge(status) {
  const s = (status || 'ACTIVE').toUpperCase();
  let pillClass = 'status-active';
  let icon = 'fa-circle-dot';

  if (s === 'CLAIMED') { pillClass = 'status-claimed'; icon = 'fa-hand-holding'; }
  else if (s === 'MATCHED') { pillClass = 'status-matched'; icon = 'fa-link'; }
  else if (s === 'RETURNED') { pillClass = 'status-returned'; icon = 'fa-check-double'; }
  else if (s === 'CLOSED') { pillClass = 'status-closed'; icon = 'fa-lock'; }

  return `<span class="status-pill ${pillClass}"><i class="fas ${icon}"></i> ${s}</span>`;
}

// -------------------------------------------------------------
// Dynamic Navbar Auth State Updater
// -------------------------------------------------------------
function updateNavAuth() {
  const user = getAuthUser();
  const navAuthContainer = document.getElementById('nav-auth-section');
  if (!navAuthContainer) return;

  if (user) {
    const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';
    const isAdmin = user.role === 'ROLE_ADMIN';

    navAuthContainer.innerHTML = `
      <div class="dropdown">
        <button class="btn btn-link text-decoration-none dropdown-toggle p-0 d-flex align-items-center gap-2" type="button" data-bs-toggle="dropdown">
          <div class="user-badge">
            <div class="avatar-circle">${initials}</div>
            <span>${user.name.split(' ')[0]}</span>
            ${isAdmin ? '<span class="badge bg-danger ms-1" style="font-size:0.65rem;">ADMIN</span>' : ''}
          </div>
        </button>
        <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2">
          <li><h6 class="dropdown-header">${user.email}</h6></li>
          <li><a class="dropdown-item" href="dashboard.html"><i class="fas fa-gauge me-2 text-primary"></i> Dashboard</a></li>
          <li><a class="dropdown-item" href="my-reports.html"><i class="fas fa-folder-open me-2 text-primary"></i> My Reports</a></li>
          ${isAdmin ? '<li><a class="dropdown-item text-danger fw-semibold" href="admin.html"><i class="fas fa-shield-halved me-2"></i> Admin Panel</a></li>' : ''}
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item text-danger" href="javascript:void(0)" onclick="logout()"><i class="fas fa-right-from-bracket me-2"></i> Sign Out</a></li>
        </ul>
      </div>
    `;
  } else {
    navAuthContainer.innerHTML = `
      <a href="login.html" class="btn btn-outline-custom me-2"><i class="fas fa-right-to-bracket"></i> Login</a>
      <a href="login.html?tab=register" class="btn btn-primary-custom"><i class="fas fa-user-plus"></i> Register</a>
    `;
  }
}

function logout() {
  clearAuth();
  showToast('Logged out successfully.', 'info');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 600);
}

// Auto update navbar on load
document.addEventListener('DOMContentLoaded', () => {
  updateNavAuth();
});
