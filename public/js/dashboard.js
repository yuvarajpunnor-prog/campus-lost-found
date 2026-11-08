/**
 * User Dashboard Controller
 * Campus Lost & Found Portal
 */

document.addEventListener('DOMContentLoaded', () => {
  const user = requireAuth();
  if (!user) return;

  // Set welcome message
  const welcomeEl = document.getElementById('dashboardWelcome');
  if (welcomeEl) {
    welcomeEl.textContent = `Welcome back, ${user.name}!`;
  }
  const userSubEl = document.getElementById('userSubtitle');
  if (userSubEl) {
    userSubEl.textContent = `${user.studentId} • ${user.email}`;
  }

  loadDashboardData(user.id);
});

async function loadDashboardData(userId) {
  try {
    // 1. Fetch user dashboard stats
    const stats = await fetchApi(`/admin/dashboard?userId=${userId}`);
    document.getElementById('statMyLost').textContent = stats.myLostItems || 0;
    document.getElementById('statMyFound').textContent = stats.myFoundItems || 0;
    document.getElementById('statMyClaims').textContent = stats.myActiveClaims || 0;
    document.getElementById('statMyResolved').textContent = stats.myResolvedItems || 0;

    // 2. Fetch user's recent reports
    const items = await fetchApi(`/items/user/${userId}`);
    renderRecentReports(items);

  } catch (err) {
    showToast('Failed to load dashboard metrics: ' + err.message, 'error');
  }
}

function renderRecentReports(items) {
  const tableBody = document.getElementById('recentReportsTableBody');
  const emptyNotice = document.getElementById('noReportsNotice');

  if (!items || items.length === 0) {
    if (tableBody) tableBody.innerHTML = '';
    if (emptyNotice) emptyNotice.classList.remove('d-none');
    return;
  }

  if (emptyNotice) emptyNotice.classList.add('d-none');

  if (tableBody) {
    tableBody.innerHTML = items.slice(0, 5).map(item => {
      const isLost = item.type === 'LOST';
      const typeBadge = isLost
        ? '<span class="badge bg-danger"><i class="fas fa-search me-1"></i>LOST</span>'
        : '<span class="badge bg-success"><i class="fas fa-check me-1"></i>FOUND</span>';

      return `
        <tr>
          <td>
            <div class="d-flex align-items-center gap-2">
              <span class="fw-bold text-dark">${item.itemName}</span>
              ${typeBadge}
            </div>
            <small class="text-muted">ID: #RPT-${item.id}</small>
          </td>
          <td><span class="badge bg-light text-dark border">${item.category}</span></td>
          <td>${formatDate(item.date)}</td>
          <td><i class="fas fa-location-dot text-muted me-1"></i>${item.location}</td>
          <td>${getStatusBadge(item.status)}</td>
          <td class="text-end">
            <a href="item-details.html?id=${item.id}" class="btn btn-sm btn-outline-custom">
              View <i class="fas fa-arrow-right ms-1"></i>
            </a>
          </td>
        </tr>
      `;
    }).join('');
  }
}
