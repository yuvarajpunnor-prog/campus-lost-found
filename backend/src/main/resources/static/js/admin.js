/**
 * Admin Dashboard Controller
 * Campus Lost & Found Portal
 */

let categoryChartInstance = null;
let statusChartInstance = null;

document.addEventListener('DOMContentLoaded', () => {
  const user = requireAuth();
  if (!user) return;

  if (user.role !== 'ROLE_ADMIN') {
    showToast('Access restricted: Administrator rights required.', 'error');
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1200);
    return;
  }

  loadAdminStats();
  loadAllUsers();
  loadAllItems();
  loadAllClaims();
});

// -------------------------------------------------------------
// Load Admin Dashboard Metrics & Charts
// -------------------------------------------------------------
async function loadAdminStats() {
  try {
    const stats = await fetchApi('/admin/dashboard');
    document.getElementById('statTotalUsers').textContent = stats.totalUsers || 0;
    document.getElementById('statTotalLost').textContent = stats.totalLostItems || 0;
    document.getElementById('statTotalFound').textContent = stats.totalFoundItems || 0;
    document.getElementById('statTotalClaims').textContent = stats.totalClaims || 0;
    document.getElementById('statItemsReturned').textContent = stats.itemsReturned || 0;

  } catch (err) {
    showToast('Failed to load admin stats: ' + err.message, 'error');
  }
}

// -------------------------------------------------------------
// Load Users
// -------------------------------------------------------------
async function loadAllUsers() {
  const tbody = document.getElementById('adminUsersTableBody');
  if (!tbody) return;

  try {
    const users = await fetchApi('/admin/users');
    tbody.innerHTML = users.map(u => `
      <tr>
        <td>#USR-${u.id}</td>
        <td>
          <div class="fw-bold">${u.name}</div>
          <small class="text-muted">${u.email}</small>
        </td>
        <td><span class="badge bg-light text-dark border">${u.studentId}</span></td>
        <td>${u.phone}</td>
        <td>
          <span class="badge ${u.role === 'ROLE_ADMIN' ? 'bg-danger' : 'bg-primary'}">${u.role}</span>
        </td>
        <td>${formatDate(u.createdAt)}</td>
        <td class="text-end">
          ${u.role !== 'ROLE_ADMIN' ? `
            <button class="btn btn-sm btn-outline-danger" onclick="deleteUser(${u.id})" title="Delete User">
              <i class="fas fa-trash"></i>
            </button>
          ` : '<span class="text-muted small">Protected</span>'}
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.error('Error loading users:', err);
  }
}

async function deleteUser(id) {
  if (!confirm('Are you sure you want to delete this user? Their reports will also be removed.')) return;

  try {
    await fetchApi(`/admin/users/${id}`, { method: 'DELETE' });
    showToast('User removed successfully.', 'info');
    loadAllUsers();
    loadAdminStats();
  } catch (err) {
    showToast('Failed to delete user: ' + err.message, 'error');
  }
}

// -------------------------------------------------------------
// Load All Items & Initialize Charts
// -------------------------------------------------------------
async function loadAllItems() {
  const tbody = document.getElementById('adminItemsTableBody');
  if (!tbody) return;

  try {
    const items = await fetchApi('/admin/items');
    
    // Render Table
    tbody.innerHTML = items.map(item => `
      <tr>
        <td>#RPT-${item.id}</td>
        <td>
          <div class="fw-bold">${item.itemName}</div>
          <small class="text-muted">${item.category} • ${item.location}</small>
        </td>
        <td>
          <span class="badge ${item.type === 'LOST' ? 'bg-danger' : 'bg-success'}">${item.type}</span>
        </td>
        <td>${formatDate(item.date)}</td>
        <td>
          <select class="form-select form-select-sm" style="width: 130px;" onchange="changeItemStatus(${item.id}, this.value)">
            <option value="ACTIVE" ${item.status === 'ACTIVE' ? 'selected' : ''}>ACTIVE</option>
            <option value="CLAIMED" ${item.status === 'CLAIMED' ? 'selected' : ''}>CLAIMED</option>
            <option value="MATCHED" ${item.status === 'MATCHED' ? 'selected' : ''}>MATCHED</option>
            <option value="RETURNED" ${item.status === 'RETURNED' ? 'selected' : ''}>RETURNED</option>
            <option value="CLOSED" ${item.status === 'CLOSED' ? 'selected' : ''}>CLOSED</option>
          </select>
        </td>
        <td>
          <small>${item.user ? item.user.name : 'Unknown'}</small>
        </td>
        <td class="text-end">
          <a href="item-details.html?id=${item.id}" class="btn btn-sm btn-outline-secondary me-1" title="View">
            <i class="fas fa-eye"></i>
          </a>
          <button class="btn btn-sm btn-outline-danger" onclick="deleteItemAdmin(${item.id})" title="Delete">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `).join('');

    // Generate Charts
    renderCharts(items);

  } catch (err) {
    console.error('Error loading items:', err);
  }
}

async function changeItemStatus(itemId, newStatus) {
  try {
    await fetchApi(`/items/${itemId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status: newStatus })
    });
    showToast(`Status updated to ${newStatus}`, 'success');
    loadAdminStats();
  } catch (err) {
    showToast('Failed to update status: ' + err.message, 'error');
  }
}

async function deleteItemAdmin(id) {
  if (!confirm('Are you sure you want to delete this item report?')) return;

  try {
    await fetchApi(`/admin/items/${id}`, { method: 'DELETE' });
    showToast('Item deleted successfully.', 'info');
    loadAllItems();
    loadAdminStats();
  } catch (err) {
    showToast('Failed to delete item: ' + err.message, 'error');
  }
}

// -------------------------------------------------------------
// Load All Claims
// -------------------------------------------------------------
async function loadAllClaims() {
  const tbody = document.getElementById('adminClaimsTableBody');
  if (!tbody) return;

  try {
    const claims = await fetchApi('/claims');
    tbody.innerHTML = claims.map(c => `
      <tr>
        <td>#CLM-${c.id}</td>
        <td>
          <div class="fw-bold">${c.item ? c.item.itemName : 'Item #' + c.id}</div>
          <small class="text-muted">Item ID: #RPT-${c.item ? c.item.id : 'N/A'}</small>
        </td>
        <td>
          <div class="fw-semibold">${c.claimantName}</div>
          <small class="text-muted">${c.claimantStudentId} • ${c.claimantPhone}</small>
        </td>
        <td>
          <div style="font-size:0.88rem;">${c.reason}</div>
          ${c.additionalDetails ? `<small class="text-muted">Details: ${c.additionalDetails}</small>` : ''}
        </td>
        <td>
          <span class="badge ${c.status === 'APPROVED' ? 'bg-success' : c.status === 'REJECTED' ? 'bg-danger' : 'bg-warning text-dark'}">
            ${c.status}
          </span>
        </td>
        <td class="text-end">
          ${c.status === 'PENDING' ? `
            <div class="d-flex gap-1 justify-content-end">
              <button class="btn btn-sm btn-success" onclick="adminReviewClaim(${c.id}, 'APPROVED')" title="Approve Claim">
                <i class="fas fa-check"></i>
              </button>
              <button class="btn btn-sm btn-danger" onclick="adminReviewClaim(${c.id}, 'REJECTED')" title="Reject Claim">
                <i class="fas fa-times"></i>
              </button>
            </div>
          ` : `<small class="text-muted">${c.status}</small>`}
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.error('Error loading claims:', err);
  }
}

async function adminReviewClaim(claimId, status) {
  try {
    await fetchApi(`/claims/${claimId}`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
    showToast(`Claim has been marked as ${status}!`, 'success');
    loadAllClaims();
    loadAllItems();
    loadAdminStats();
  } catch (err) {
    showToast('Failed to review claim: ' + err.message, 'error');
  }
}

// -------------------------------------------------------------
// Interactive Charts (Chart.js)
// -------------------------------------------------------------
function renderCharts(items) {
  if (typeof Chart === 'undefined') return;

  // 1. Category Chart
  const categoryCounts = {};
  items.forEach(i => {
    categoryCounts[i.category] = (categoryCounts[i.category] || 0) + 1;
  });

  const catCanvas = document.getElementById('categoryChart');
  if (catCanvas) {
    if (categoryChartInstance) categoryChartInstance.destroy();
    categoryChartInstance = new Chart(catCanvas, {
      type: 'doughnut',
      data: {
        labels: Object.keys(categoryCounts),
        datasets: [{
          data: Object.values(categoryCounts),
          backgroundColor: [
            '#2563eb', '#10b981', '#f59e0b', '#8b5cf6', 
            '#ec4899', '#06b6d4', '#64748b', '#f97316'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }

  // 2. Status Chart
  const statusCounts = {};
  items.forEach(i => {
    statusCounts[i.status] = (statusCounts[i.status] || 0) + 1;
  });

  const statusCanvas = document.getElementById('statusChart');
  if (statusCanvas) {
    if (statusChartInstance) statusChartInstance.destroy();
    statusChartInstance = new Chart(statusCanvas, {
      type: 'bar',
      data: {
        labels: Object.keys(statusCounts),
        datasets: [{
          label: 'Item Reports',
          data: Object.values(statusCounts),
          backgroundColor: '#1e3a8a',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1 } }
        }
      }
    });
  }
}
