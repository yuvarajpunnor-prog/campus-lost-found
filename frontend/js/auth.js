/**
 * Authentication Management (Login, Registration, Demo Credentials)
 * Campus Lost & Found Portal
 */

document.addEventListener('DOMContentLoaded', () => {
  // Check URL param to see if register tab should be active
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('tab') === 'register') {
    const registerTabBtn = document.getElementById('register-tab-btn');
    if (registerTabBtn) {
      const tab = new bootstrap.Tab(registerTabBtn);
      tab.show();
    }
  }

  // If already logged in, show notice or allow continuing to dashboard
  const user = getAuthUser();
  if (user && document.getElementById('loginForm')) {
    const banner = document.getElementById('already-logged-in');
    if (banner) {
      banner.classList.remove('d-none');
      banner.innerHTML = `
        <div class="alert alert-info d-flex align-items-center justify-content-between mb-4">
          <div><i class="fas fa-info-circle me-2"></i> You are currently signed in as <strong>${user.name}</strong> (${user.role === 'ROLE_ADMIN' ? 'Admin' : 'Student'}).</div>
          <a href="${user.role === 'ROLE_ADMIN' ? 'admin.html' : 'dashboard.html'}" class="btn btn-sm btn-primary">Go to Dashboard</a>
        </div>
      `;
    }
  }

  // Setup Login Form Handler
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  // Setup Register Form Handler
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }
});

async function handleLogin(e) {
  e.preventDefault();
  const emailInput = document.getElementById('loginEmail');
  const passwordInput = document.getElementById('loginPassword');
  const submitBtn = document.getElementById('loginSubmitBtn');

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    showToast('Please enter both email and password.', 'warning');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Signing in...';

  try {
    const res = await fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    if (res.success) {
      setAuthUser(res);
      showToast('Welcome back, ' + res.name + '!', 'success');
      setTimeout(() => {
        if (res.role === 'ROLE_ADMIN') {
          window.location.href = 'admin.html';
        } else {
          window.location.href = 'dashboard.html';
        }
      }, 800);
    } else {
      showToast(res.message || 'Login failed.', 'error');
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-right-to-bracket me-2"></i>Sign In';
    }
  } catch (err) {
    let msg = err.message || 'Login failed.';
    if (msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('ERR_CONNECTION_REFUSED')) {
      msg = '⚠️ Backend server is not running! Open terminal and run: java -jar backend\\target\\campus-lost-found-1.0.0.jar';
    }
    showToast(msg, 'error');
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-right-to-bracket me-2"></i>Sign In';
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const studentId = document.getElementById('regStudentId').value.trim();
  const phone = document.getElementById('regPhone').value.trim();
  const password = document.getElementById('regPassword').value;
  const confirmPassword = document.getElementById('regConfirmPassword').value;
  const submitBtn = document.getElementById('regSubmitBtn');

  if (!name || !email || !studentId || !phone || !password) {
    showToast('All fields are required.', 'warning');
    return;
  }

  if (password.length < 6) {
    showToast('Password must be at least 6 characters long.', 'warning');
    return;
  }

  if (password !== confirmPassword) {
    showToast('Passwords do not match.', 'error');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Creating Account...';

  try {
    const res = await fetchApi('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        studentId,
        phone,
        password,
        role: 'ROLE_STUDENT'
      })
    });

    if (res.success) {
      setAuthUser(res);
      showToast('Registration successful! Redirecting to Dashboard...', 'success');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1000);
    } else {
      showToast(res.message || 'Registration failed.', 'error');
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-user-plus me-2"></i>Create Account';
    }
  } catch (err) {
    showToast(err.message || 'Registration failed. Email or Student ID may already exist.', 'error');
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-user-plus me-2"></i>Create Account';
  }
}

// Quick Demo Credential Fillers for college presentation
function fillDemoStudent() {
  document.getElementById('loginEmail').value = 'rahul@campus.edu';
  document.getElementById('loginPassword').value = 'password123';
  showToast('Filled student credentials (Rahul Sharma)', 'info');
}

function fillDemoAdmin() {
  document.getElementById('loginEmail').value = 'admin@campus.edu';
  document.getElementById('loginPassword').value = 'admin123';
  showToast('Filled Campus Admin credentials', 'info');
}
