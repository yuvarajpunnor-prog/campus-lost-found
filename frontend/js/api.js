/**
 * Central API Client and Utility Functions
 * Campus Lost & Found Portal
 * Supports: Node.js Express, Spring Boot, Vercel Serverless, and GitHub Pages Client-Side Simulation
 */

const API_BASE = (window.location.port === '5500') 
  ? 'http://localhost:8080/api' 
  : '/api';

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
// Client-Side Mock Database (Ensures Zero-Downtime on GitHub Pages)
// -------------------------------------------------------------
const MOCK_STORAGE_KEY = 'campus_mock_db_v1';

function getMockDb() {
  const existing = localStorage.getItem(MOCK_STORAGE_KEY);
  if (existing) {
    try { return JSON.parse(existing); } catch(e) {}
  }
  const initial = {
    users: [
      { id: 1, name: 'Campus Administrator', email: 'admin@campus.edu', studentId: 'ADM-001', phone: '+1-555-0100', password: 'admin123', role: 'ROLE_ADMIN' },
      { id: 2, name: 'Rahul Sharma', email: 'rahul@campus.edu', studentId: 'CS2024-042', phone: '+1-555-0142', password: 'password123', role: 'ROLE_STUDENT' },
      { id: 3, name: 'Priya Patel', email: 'priya@campus.edu', studentId: 'EE2023-018', phone: '+1-555-0118', password: 'password123', role: 'ROLE_STUDENT' },
      { id: 4, name: 'Arjun Verma', email: 'arjun@campus.edu', studentId: 'ME2024-089', phone: '+1-555-0189', password: 'password123', role: 'ROLE_STUDENT' }
    ],
    items: [
      {
        id: 1,
        itemName: 'Black Boat Rockerz Earphones',
        type: 'FOUND',
        category: 'Electronics',
        description: 'Found on table 4 in the 2nd-floor reading area. Kept securely at the library desk.',
        date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
        time: '03:30 PM',
        location: 'Central Library 2nd Floor',
        color: 'Black',
        brand: 'Boat',
        identifyingDetails: 'Slight scratch on the left earpiece button.',
        currentLocation: 'Library Main Reception Desk',
        contactInfo: 'librarian@campus.edu',
        imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
        status: 'ACTIVE',
        userId: 3,
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
      },
      {
        id: 2,
        itemName: 'Black Boat Earphones',
        type: 'LOST',
        category: 'Electronics',
        description: 'Lost during group study session near library window desks. Has sentimental value.',
        date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
        time: '03:00 PM',
        location: 'Central Library',
        color: 'Black',
        brand: 'Boat',
        identifyingDetails: 'Black neckband with silver logo.',
        currentLocation: 'Campus Area',
        contactInfo: '+1-555-0142',
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
        status: 'ACTIVE',
        userId: 2,
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
      },
      {
        id: 3,
        itemName: 'Campus Student ID Card',
        type: 'FOUND',
        category: 'ID Cards',
        description: 'Student identity card found near cafeteria checkout counter.',
        date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0],
        time: '01:15 PM',
        location: 'Campus Cafeteria Food Court',
        color: 'Blue',
        brand: 'College Issued',
        identifyingDetails: 'Department of Mechanical Engineering, ID ending in 089.',
        currentLocation: 'Campus Security Post Gate 1',
        contactInfo: 'security@campus.edu',
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
        status: 'ACTIVE',
        userId: 2,
        createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
      },
      {
        id: 4,
        itemName: 'Casio Vintage Digital Watch',
        type: 'FOUND',
        category: 'Accessories',
        description: 'Found on the bench beside the outdoor basketball court after evening match.',
        date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
        time: '05:45 PM',
        location: 'Sports Complex Basketball Court',
        color: 'Silver',
        brand: 'Casio',
        identifyingDetails: 'Stainless steel band, minor scuff on top bezel.',
        currentLocation: 'Sports Department In-charge Room 102',
        contactInfo: '+1-555-0189',
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
        status: 'ACTIVE',
        userId: 4,
        createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
      },
      {
        id: 5,
        itemName: 'HP 65W Laptop Charger',
        type: 'LOST',
        category: 'Electronics',
        description: 'Left behind after CS lab practical session. Urgent needed for semester exam preparation.',
        date: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0],
        time: '11:30 AM',
        location: 'Computer Lab 3 Block C',
        color: 'Black',
        brand: 'HP',
        identifyingDetails: 'Blue tip barrel connector with yellow sticker label.',
        currentLocation: 'Computer Science Lab',
        contactInfo: '+1-555-0118',
        imageUrl: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=600&auto=format&fit=crop&q=80',
        status: 'ACTIVE',
        userId: 3,
        createdAt: new Date(Date.now() - 4 * 86400000).toISOString()
      },
      {
        id: 6,
        itemName: 'Blue Skybags Laptop Backpack',
        type: 'FOUND',
        category: 'Bags',
        description: 'Found left on the back row seat after the guest lecture in Seminar Hall 2.',
        date: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0],
        time: '04:00 PM',
        location: 'Seminar Hall 2 Admin Block',
        color: 'Blue',
        brand: 'Skybags',
        identifyingDetails: 'Has a NASA keychain attached to the front pocket zip.',
        currentLocation: 'Admin Office Enquiry Counter',
        contactInfo: 'admin@campus.edu',
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
        status: 'RETURNED',
        userId: 1,
        createdAt: new Date(Date.now() - 5 * 86400000).toISOString()
      },
      {
        id: 7,
        itemName: 'Chemistry Lab Record Notebook',
        type: 'LOST',
        category: 'Books',
        description: 'Spiral-bound chemistry lab record book with blue hard cover.',
        date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0],
        time: '02:00 PM',
        location: 'Chemistry Block Room 204',
        color: 'Blue',
        brand: 'College Stationery',
        identifyingDetails: 'Roll Number CS2024-042 written on the index page.',
        currentLocation: 'Chemistry Lab',
        contactInfo: '+1-555-0142',
        imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
        status: 'ACTIVE',
        userId: 2,
        createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
      },
      {
        id: 8,
        itemName: 'Brown Leather Fossil Wallet',
        type: 'FOUND',
        category: 'Accessories',
        description: 'Found under the bench in the campus garden pathway.',
        date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
        time: '12:45 PM',
        location: 'Campus Main Garden',
        color: 'Brown',
        brand: 'Fossil',
        identifyingDetails: 'Contains campus transit card and coins. Kept safely.',
        currentLocation: 'Student Affairs Office Room 12',
        contactInfo: 'affairs@campus.edu',
        imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80',
        status: 'ACTIVE',
        userId: 4,
        createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
      }
    ],
    claims: [
      {
        id: 1,
        itemId: 4,
        claimantId: 3,
        claimantName: 'Priya Patel',
        claimantStudentId: 'EE2023-018',
        claimantPhone: '+1-555-0118',
        reason: 'I lost my silver Casio vintage watch during practice on Tuesday evening.',
        additionalDetails: 'The watch display has a 24-hour mode enabled, and there is a small scratch near the top right button.',
        status: 'PENDING',
        adminNotes: null,
        createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
      }
    ],
    nextUserId: 5,
    nextItemId: 9,
    nextClaimId: 2
  };
  saveMockDb(initial);
  return initial;
}

function saveMockDb(db) {
  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(db));
}

function handleMockRequest(endpoint, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const db = getMockDb();
  const urlObj = new URL(endpoint, 'http://localhost');
  const path = urlObj.pathname;
  const params = urlObj.searchParams;

  let body = {};
  if (options.body) {
    if (typeof options.body === 'string') {
      try { body = JSON.parse(options.body); } catch(e) {}
    } else if (options.body instanceof FormData) {
      body = {};
      options.body.forEach((val, key) => { body[key] = val; });
    }
  }

  // Auth: Login
  if (path === '/auth/login' && method === 'POST') {
    const { email, password } = body;
    const user = db.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
    if (user && user.password === password) {
      return {
        success: true,
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        phone: user.phone,
        token: 'demo-token-' + user.id
      };
    }
    throw new Error('Invalid email or password');
  }

  // Auth: Register
  if (path === '/auth/register' && method === 'POST') {
    const { name, email, studentId, phone, password, role } = body;
    const newUser = {
      id: db.nextUserId++,
      name, email, studentId, phone, password,
      role: role || 'ROLE_STUDENT',
      createdAt: new Date().toISOString()
    };
    db.users.push(newUser);
    saveMockDb(db);
    return {
      success: true,
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      studentId: newUser.studentId,
      phone: newUser.phone,
      token: 'demo-token-' + newUser.id
    };
  }

  // Upload
  if (path === '/upload') {
    return { url: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=600&auto=format&fit=crop&q=80' };
  }

  // Items: Search
  if (path === '/items/search') {
    const type = params.get('type');
    const category = params.get('category');
    const status = params.get('status');
    const location = params.get('location');
    const keyword = params.get('keyword');

    let results = db.items;
    if (type) results = results.filter(i => i.type.toLowerCase() === type.toLowerCase());
    if (category) results = results.filter(i => (i.category || '').toLowerCase() === category.toLowerCase());
    if (status) results = results.filter(i => (i.status || '').toLowerCase() === status.toLowerCase());
    if (location) results = results.filter(i => (i.location || '').toLowerCase().includes(location.toLowerCase()));
    if (keyword) {
      const k = keyword.toLowerCase();
      results = results.filter(i => (i.itemName || '').toLowerCase().includes(k) || (i.description || '').toLowerCase().includes(k));
    }
    return results;
  }

  // Items: Recent Found
  if (path === '/items/recent-found') {
    return db.items.filter(i => i.type === 'FOUND').slice(0, 6);
  }

  // Items: User Items
  const userItemsMatch = path.match(/^\/items\/user\/(\d+)/);
  if (userItemsMatch) {
    const uid = parseInt(userItemsMatch[1], 10);
    const type = params.get('type');
    let res = db.items.filter(i => i.userId === uid);
    if (type) res = res.filter(i => i.type.toLowerCase() === type.toLowerCase());
    return res;
  }

  // Items: Matches
  const matchesMatch = path.match(/^\/items\/(\d+)\/matches/);
  if (matchesMatch) {
    const targetId = parseInt(matchesMatch[1], 10);
    const target = db.items.find(i => i.id === targetId);
    if (!target) return [];
    const opp = target.type === 'LOST' ? 'FOUND' : 'LOST';
    const cands = db.items.filter(i => i.type === opp);
    return cands.map(c => ({
      item: c,
      matchScore: 85,
      matchReasons: ['Same Category (' + c.category + ')', 'Location match']
    }));
  }

  // Items: Single
  const singleItemMatch = path.match(/^\/items\/(\d+)$/);
  if (singleItemMatch && method === 'GET') {
    const itemId = parseInt(singleItemMatch[1], 10);
    const item = db.items.find(i => i.id === itemId);
    if (!item) throw new Error('Item not found');
    const user = db.users.find(u => u.id === item.userId);
    return { ...item, user };
  }

  // Items: Update status
  const itemStatusMatch = path.match(/^\/items\/(\d+)\/status$/);
  if (itemStatusMatch && method === 'PUT') {
    const itemId = parseInt(itemStatusMatch[1], 10);
    const item = db.items.find(i => i.id === itemId);
    if (item && body.status) {
      item.status = body.status;
      saveMockDb(db);
      return item;
    }
  }

  // Items: Delete
  if (singleItemMatch && method === 'DELETE') {
    const itemId = parseInt(singleItemMatch[1], 10);
    db.items = db.items.filter(i => i.id !== itemId);
    saveMockDb(db);
    return { message: 'Item deleted' };
  }

  // Items: Create
  if ((path === '/items' || path === '/items/lost' || path === '/items/found') && method === 'POST') {
    const newItem = {
      id: db.nextItemId++,
      itemName: body.itemName || 'Untitled Item',
      type: path.includes('lost') ? 'LOST' : (path.includes('found') ? 'FOUND' : (body.type || 'LOST')),
      category: body.category || 'General',
      description: body.description || '',
      date: body.date || new Date().toISOString().split('T')[0],
      time: body.time || '',
      location: body.location || 'Campus',
      color: body.color || '',
      brand: body.brand || '',
      identifyingDetails: body.identifyingDetails || '',
      currentLocation: body.currentLocation || body.location || '',
      contactInfo: body.contactInfo || '',
      imageUrl: body.imageUrl || 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=600&auto=format&fit=crop&q=80',
      status: 'ACTIVE',
      userId: body.userId ? parseInt(body.userId, 10) : 1,
      createdAt: new Date().toISOString()
    };
    db.items.unshift(newItem);
    saveMockDb(db);
    return newItem;
  }

  // Items: All
  if (path === '/items' && method === 'GET') {
    const type = params.get('type');
    if (type) return db.items.filter(i => i.type.toUpperCase() === type.toUpperCase());
    return db.items;
  }

  // Claims
  if (path === '/claims' && method === 'POST') {
    const newClaim = {
      id: db.nextClaimId++,
      itemId: parseInt(body.itemId, 10),
      claimantId: parseInt(body.claimantId, 10),
      claimantName: body.claimantName || 'Student',
      claimantStudentId: body.claimantStudentId || '',
      claimantPhone: body.claimantPhone || '',
      reason: body.reason || '',
      additionalDetails: body.additionalDetails || '',
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };
    db.claims.unshift(newClaim);
    saveMockDb(db);
    return newClaim;
  }

  if (path === '/claims' && method === 'GET') {
    return db.claims.map(c => ({
      ...c,
      item: db.items.find(i => i.id === c.itemId),
      claimant: db.users.find(u => u.id === c.claimantId)
    }));
  }

  const claimUserMatch = path.match(/^\/claims\/user\/(\d+)/);
  if (claimUserMatch) {
    const uid = parseInt(claimUserMatch[1], 10);
    return db.claims.filter(c => c.claimantId === uid).map(c => ({
      ...c,
      item: db.items.find(i => i.id === c.itemId)
    }));
  }

  const claimOwnerMatch = path.match(/^\/claims\/owner\/(\d+)/);
  if (claimOwnerMatch) {
    const oid = parseInt(claimOwnerMatch[1], 10);
    const oItemIds = db.items.filter(i => i.userId === oid).map(i => i.id);
    return db.claims.filter(c => oItemIds.includes(c.itemId)).map(c => ({
      ...c,
      item: db.items.find(i => i.id === c.itemId),
      claimant: db.users.find(u => u.id === c.claimantId)
    }));
  }

  const updateClaimMatch = path.match(/^\/claims\/(\d+)/);
  if (updateClaimMatch && method === 'PUT') {
    const cid = parseInt(updateClaimMatch[1], 10);
    const claim = db.claims.find(c => c.id === cid);
    if (claim && body.status) {
      claim.status = body.status;
      if (body.status.toUpperCase() === 'APPROVED') {
        const item = db.items.find(i => i.id === claim.itemId);
        if (item) item.status = 'CLAIMED';
      }
      saveMockDb(db);
      return claim;
    }
  }

  // Admin Dashboard
  if (path === '/admin/dashboard') {
    const totalUsers = db.users.length;
    const totalLostItems = db.items.filter(i => i.type === 'LOST').length;
    const totalFoundItems = db.items.filter(i => i.type === 'FOUND').length;
    const totalClaims = db.claims.length;
    const itemsReturned = db.items.filter(i => i.status === 'RETURNED' || i.status === 'CLAIMED').length;
    const activeReports = db.items.filter(i => i.status === 'ACTIVE').length;

    let myLostItems = 0, myFoundItems = 0, myActiveClaims = 0, myResolvedItems = 0;
    const uid = params.get('userId') ? parseInt(params.get('userId'), 10) : null;
    if (uid) {
      myLostItems = db.items.filter(i => i.userId === uid && i.type === 'LOST').length;
      myFoundItems = db.items.filter(i => i.userId === uid && i.type === 'FOUND').length;
      myActiveClaims = db.claims.filter(c => c.claimantId === uid && c.status === 'PENDING').length;
      myResolvedItems = db.items.filter(i => i.userId === uid && (i.status === 'RETURNED' || i.status === 'CLAIMED')).length;
    }

    return {
      totalUsers, totalLostItems, totalFoundItems, totalClaims,
      itemsReturned, activeReports,
      myLostItems, myFoundItems, myActiveClaims, myResolvedItems
    };
  }

  if (path === '/admin/users') {
    return db.users;
  }

  if (path === '/admin/items') {
    return db.items;
  }

  return [];
}

// -------------------------------------------------------------
// Universal API Request Helper (Hybrid: Network First with Client-Side Fallback)
// -------------------------------------------------------------
async function fetchApi(endpoint, options = {}) {
  // If hosted on GitHub Pages or file protocol, use client-side mock engine directly
  const isGitHubPages = window.location.hostname.includes('github.io') || window.location.protocol === 'file:';

  if (!isGitHubPages) {
    const url = `${API_BASE}${endpoint}`;
    const defaultHeaders = { 'Accept': 'application/json' };
    if (!(options.body instanceof FormData)) {
      defaultHeaders['Content-Type'] = 'application/json';
    }

    const config = {
      ...options,
      headers: { ...defaultHeaders, ...(options.headers || {}) }
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json().catch(() => null);

      if (response.ok) {
        return data;
      }
      // If server returned 404/405/500, fallback to client-side engine gracefully
      console.warn(`Server responded with ${response.status} on ${endpoint}, using client fallback.`);
    } catch (networkErr) {
      console.warn(`Backend unreachable on ${endpoint}, using client fallback.`);
    }
  }

  // Client-Side Execution Engine
  return handleMockRequest(endpoint, options);
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

document.addEventListener('DOMContentLoaded', () => {
  updateNavAuth();
});
