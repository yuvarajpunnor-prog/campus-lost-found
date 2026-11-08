/**
 * My Reports Management Controller
 * Campus Lost & Found Portal
 */

let activeUser = null;
let itemToDeleteId = null;

document.addEventListener('DOMContentLoaded', () => {
  activeUser = requireAuth();
  if (!activeUser) return;

  loadMyLostItems();
  loadMyFoundItems();
  loadMyClaims();
  loadClaimsOnMyItems();

  // Setup Edit Form Submission
  const editForm = document.getElementById('editItemForm');
  if (editForm) {
    editForm.addEventListener('submit', handleEditSubmit);
  }
});

// -------------------------------------------------------------
// Load Lost Items
// -------------------------------------------------------------
async function loadMyLostItems() {
  const container = document.getElementById('myLostTableBody');
  const emptyEl = document.getElementById('emptyLost');
  if (!container) return;

  try {
    const items = await fetchApi(`/items/user/${activeUser.id}?type=LOST`);
    if (!items || items.length === 0) {
      container.innerHTML = '';
      if (emptyEl) emptyEl.classList.remove('d-none');
      return;
    }

    if (emptyEl) emptyEl.classList.add('d-none');

    container.innerHTML = items.map(item => `
      <tr>
        <td>
          <div class="fw-bold">${item.itemName}</div>
          <small class="text-muted">#RPT-${item.id} • ${item.category}</small>
        </td>
        <td>${formatDate(item.date)}</td>
        <td>${item.location}</td>
        <td>${getStatusBadge(item.status)}</td>
        <td>
          <div class="d-flex gap-2 justify-content-end">
            <a href="item-details.html?id=${item.id}" class="btn btn-sm btn-outline-secondary" title="View Details">
              <i class="fas fa-eye"></i>
            </a>
            <button class="btn btn-sm btn-outline-primary" onclick="openEditModal(${item.id})" title="Edit Report">
              <i class="fas fa-pencil"></i>
            </button>
            ${item.status !== 'RETURNED' ? `
              <button class="btn btn-sm btn-outline-success" onclick="markAsReturned(${item.id})" title="Mark as Recovered">
                <i class="fas fa-check"></i>
              </button>
            ` : ''}
            <button class="btn btn-sm btn-outline-danger" onclick="confirmDelete(${item.id})" title="Delete">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    showToast('Failed to load lost items: ' + err.message, 'error');
  }
}

// -------------------------------------------------------------
// Load Found Items
// -------------------------------------------------------------
async function loadMyFoundItems() {
  const container = document.getElementById('myFoundTableBody');
  const emptyEl = document.getElementById('emptyFound');
  if (!container) return;

  try {
    const items = await fetchApi(`/items/user/${activeUser.id}?type=FOUND`);
    if (!items || items.length === 0) {
      container.innerHTML = '';
      if (emptyEl) emptyEl.classList.remove('d-none');
      return;
    }

    if (emptyEl) emptyEl.classList.add('d-none');

    container.innerHTML = items.map(item => `
      <tr>
        <td>
          <div class="fw-bold">${item.itemName}</div>
          <small class="text-muted">#RPT-${item.id} • ${item.category}</small>
        </td>
        <td>${formatDate(item.date)}</td>
        <td>${item.location}</td>
        <td>${getStatusBadge(item.status)}</td>
        <td>
          <div class="d-flex gap-2 justify-content-end">
            <a href="item-details.html?id=${item.id}" class="btn btn-sm btn-outline-secondary" title="View Details">
              <i class="fas fa-eye"></i>
            </a>
            <button class="btn btn-sm btn-outline-primary" onclick="openEditModal(${item.id})" title="Edit Report">
              <i class="fas fa-pencil"></i>
            </button>
            ${item.status !== 'RETURNED' ? `
              <button class="btn btn-sm btn-outline-success" onclick="markAsReturned(${item.id})" title="Mark as Returned">
                <i class="fas fa-check"></i>
              </button>
            ` : ''}
            <button class="btn btn-sm btn-outline-danger" onclick="confirmDelete(${item.id})" title="Delete">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    showToast('Failed to load found items: ' + err.message, 'error');
  }
}

// -------------------------------------------------------------
// Load My Submitted Claims
// -------------------------------------------------------------
async function loadMyClaims() {
  const container = document.getElementById('myClaimsTableBody');
  const emptyEl = document.getElementById('emptyClaims');
  if (!container) return;

  try {
    const claims = await fetchApi(`/claims/user/${activeUser.id}`);
    if (!claims || claims.length === 0) {
      container.innerHTML = '';
      if (emptyEl) emptyEl.classList.remove('d-none');
      return;
    }

    if (emptyEl) emptyEl.classList.add('d-none');

    container.innerHTML = claims.map(c => {
      let statusBadge = '<span class="badge bg-warning text-dark"><i class="fas fa-clock me-1"></i>PENDING</span>';
      if (c.status === 'APPROVED') statusBadge = '<span class="badge bg-success"><i class="fas fa-check-circle me-1"></i>APPROVED</span>';
      else if (c.status === 'REJECTED') statusBadge = '<span class="badge bg-danger"><i class="fas fa-times-circle me-1"></i>REJECTED</span>';

      return `
        <tr>
          <td>
            <div class="fw-bold">${c.item ? c.item.itemName : 'Item #' + c.id}</div>
            <small class="text-muted"><i class="fas fa-location-dot me-1"></i>${c.item ? c.item.location : 'Campus'}</small>
          </td>
          <td>${formatDate(c.createdAt)}</td>
          <td>
            <div class="text-truncate" style="max-width: 250px;" title="${c.reason}">${c.reason}</div>
          </td>
          <td>${statusBadge}</td>
          <td>
            ${c.item ? `<a href="item-details.html?id=${c.item.id}" class="btn btn-sm btn-outline-secondary">View Item</a>` : ''}
          </td>
        </tr>
      `;
    }).join('');
  } catch (err) {
    showToast('Failed to load claims: ' + err.message, 'error');
  }
}

// -------------------------------------------------------------
// Load Claims made on items I found
// -------------------------------------------------------------
async function loadClaimsOnMyItems() {
  const container = document.getElementById('claimsOnMyItemsTableBody');
  const emptyEl = document.getElementById('emptyClaimsOnMyItems');
  if (!container) return;

  try {
    const claims = await fetchApi(`/claims/owner/${activeUser.id}`);
    if (!claims || claims.length === 0) {
      container.innerHTML = '';
      if (emptyEl) emptyEl.classList.remove('d-none');
      return;
    }

    if (emptyEl) emptyEl.classList.add('d-none');

    container.innerHTML = claims.map(c => `
      <tr>
        <td>
          <div class="fw-bold">${c.item ? c.item.itemName : 'Found Item'}</div>
          <small class="text-muted">#CLM-${c.id}</small>
        </td>
        <td>
          <div class="fw-semibold">${c.claimantName}</div>
          <small class="text-muted">${c.claimantStudentId} • ${c.claimantPhone}</small>
        </td>
        <td>
          <div style="font-size:0.88rem;">${c.reason}</div>
          ${c.additionalDetails ? `<small class="text-muted">Proof: ${c.additionalDetails}</small>` : ''}
        </td>
        <td>
          <span class="badge ${c.status === 'APPROVED' ? 'bg-success' : c.status === 'REJECTED' ? 'bg-danger' : 'bg-warning text-dark'}">
            ${c.status}
          </span>
        </td>
        <td>
          ${c.status === 'PENDING' ? `
            <div class="d-flex gap-1">
              <button class="btn btn-sm btn-success" onclick="updateClaimStatus(${c.id}, 'APPROVED')" title="Approve">
                <i class="fas fa-check"></i>
              </button>
              <button class="btn btn-sm btn-danger" onclick="updateClaimStatus(${c.id}, 'REJECTED')" title="Reject">
                <i class="fas fa-times"></i>
              </button>
            </div>
          ` : '<span class="text-muted small">Resolved</span>'}
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.warn('Could not load claims on my items:', err);
  }
}

async function updateClaimStatus(claimId, status) {
  try {
    await fetchApi(`/claims/${claimId}`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
    showToast(`Claim has been ${status.toLowerCase()}!`, 'success');
    loadClaimsOnMyItems();
    loadMyFoundItems();
  } catch (err) {
    showToast('Failed to update claim: ' + err.message, 'error');
  }
}

// -------------------------------------------------------------
// Mark as Returned
// -------------------------------------------------------------
async function markAsReturned(itemId) {
  try {
    await fetchApi(`/items/${itemId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'RETURNED' })
    });
    showToast('Item marked as successfully returned/resolved!', 'success');
    loadMyLostItems();
    loadMyFoundItems();
  } catch (err) {
    showToast('Error updating status: ' + err.message, 'error');
  }
}

// -------------------------------------------------------------
// Edit Item Modal
// -------------------------------------------------------------
async function openEditModal(itemId) {
  try {
    const item = await fetchApi(`/items/${itemId}`);
    document.getElementById('editItemId').value = item.id;
    document.getElementById('editItemName').value = item.itemName;
    document.getElementById('editCategory').value = item.category;
    document.getElementById('editLocation').value = item.location;
    document.getElementById('editDate').value = item.date || '';
    document.getElementById('editTime').value = item.time || '';
    document.getElementById('editColor').value = item.color || '';
    document.getElementById('editBrand').value = item.brand || '';
    document.getElementById('editDescription').value = item.description || '';
    document.getElementById('editIdentifyingDetails').value = item.identifyingDetails || '';

    const modal = new bootstrap.Modal(document.getElementById('editItemModal'));
    modal.show();
  } catch (err) {
    showToast('Could not load item details for edit: ' + err.message, 'error');
  }
}

async function handleEditSubmit(e) {
  e.preventDefault();
  const itemId = document.getElementById('editItemId').value;

  const payload = {
    itemName: document.getElementById('editItemName').value.trim(),
    category: document.getElementById('editCategory').value,
    location: document.getElementById('editLocation').value.trim(),
    date: document.getElementById('editDate').value || null,
    time: document.getElementById('editTime').value.trim(),
    color: document.getElementById('editColor').value.trim(),
    brand: document.getElementById('editBrand').value.trim(),
    description: document.getElementById('editDescription').value.trim(),
    identifyingDetails: document.getElementById('editIdentifyingDetails').value.trim(),
    type: 'LOST', // Service preserves current
    userId: activeUser.id
  };

  try {
    await fetchApi(`/items/${itemId}?userId=${activeUser.id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });

    const modalEl = document.getElementById('editItemModal');
    const bsModal = bootstrap.Modal.getInstance(modalEl);
    if (bsModal) bsModal.hide();

    showToast('Item report updated successfully!', 'success');
    loadMyLostItems();
    loadMyFoundItems();
  } catch (err) {
    showToast('Failed to save edits: ' + err.message, 'error');
  }
}

// -------------------------------------------------------------
// Delete Item with Confirmation Popup
// -------------------------------------------------------------
function confirmDelete(itemId) {
  itemToDeleteId = itemId;
  const modalEl = document.getElementById('deleteConfirmModal');
  const modal = new bootstrap.Modal(modalEl);
  modal.show();
}

async function executeDelete() {
  if (!itemToDeleteId) return;

  try {
    await fetchApi(`/items/${itemToDeleteId}?userId=${activeUser.id}`, {
      method: 'DELETE'
    });

    const modalEl = document.getElementById('deleteConfirmModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();

    showToast('Report deleted successfully.', 'info');
    loadMyLostItems();
    loadMyFoundItems();
  } catch (err) {
    showToast('Failed to delete report: ' + err.message, 'error');
  } finally {
    itemToDeleteId = null;
  }
}
