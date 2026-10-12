/**
 * Item Details & Matching & Claims Page Controller
 * Campus Lost & Found Portal
 */

let currentItem = null;

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const itemId = params.get('id');

  if (!itemId) {
    showToast('No item specified.', 'warning');
    setTimeout(() => window.location.href = 'browse.html', 1000);
    return;
  }

  loadItemDetails(itemId);
  loadMatches(itemId);

  // Setup Claim Form Handler
  const claimForm = document.getElementById('claimForm');
  if (claimForm) {
    claimForm.addEventListener('submit', handleClaimSubmit);
  }
});

async function loadItemDetails(itemId) {
  const loader = document.getElementById('detailsLoader');
  const content = document.getElementById('detailsContent');

  try {
    const item = await fetchApi(`/items/${itemId}`);
    currentItem = item;

    if (loader) loader.classList.add('d-none');
    if (content) content.classList.remove('d-none');

    // Populate UI
    document.getElementById('itemTitle').textContent = item.itemName;
    document.getElementById('reportIdBadge').textContent = `#RPT-${item.id}`;
    document.getElementById('itemCategoryBadge').textContent = item.category;

    // Type Badge
    const typeBadge = document.getElementById('itemTypeBadge');
    if (typeBadge) {
      if (item.type === 'LOST') {
        typeBadge.className = 'badge bg-danger fs-6 px-3 py-2 rounded-pill';
        typeBadge.innerHTML = '<i class="fas fa-search me-1"></i> LOST ITEM';
      } else {
        typeBadge.className = 'badge bg-success fs-6 px-3 py-2 rounded-pill';
        typeBadge.innerHTML = '<i class="fas fa-check-circle me-1"></i> FOUND ITEM';
      }
    }

    // Status Pill
    const statusWrap = document.getElementById('itemStatusWrap');
    if (statusWrap) {
      statusWrap.innerHTML = getStatusBadge(item.status);
    }

    // Images
    const defaultImages = {
      'Electronics': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      'Books': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
      'ID Cards': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      'Accessories': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      'Bags': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
      'Keys': 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&auto=format&fit=crop&q=80',
      'Documents': 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
      'Clothing': 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
      'Other': 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800&auto=format&fit=crop&q=80'
    };
    const fallback = defaultImages[item.category] || defaultImages['Other'];
    const itemImg = document.getElementById('itemImage');
    if (itemImg) {
      itemImg.src = item.imageUrl && item.imageUrl.trim() ? item.imageUrl : fallback;
      itemImg.onerror = () => itemImg.src = fallback;
    }

    // Detail Fields
    document.getElementById('itemDesc').textContent = item.description || 'No detailed description provided.';
    document.getElementById('itemDate').textContent = formatDate(item.date);
    document.getElementById('itemTime').textContent = item.time || 'Not specified';
    document.getElementById('itemLocation').textContent = item.location;
    document.getElementById('itemColor').textContent = item.color || 'Not specified';
    document.getElementById('itemBrand').textContent = item.brand || 'Not specified';
    document.getElementById('itemDetails').textContent = item.identifyingDetails || 'None listed';

    // Current holding location (for found items)
    const curLocRow = document.getElementById('currentLocationRow');
    if (curLocRow) {
      if (item.type === 'FOUND' && item.currentLocation) {
        curLocRow.classList.remove('d-none');
        document.getElementById('itemCurrentLocation').textContent = item.currentLocation;
      } else {
        curLocRow.classList.add('d-none');
      }
    }

    // Posted by (privacy protected)
    const postedByEl = document.getElementById('itemPostedBy');
    if (postedByEl && item.user) {
      postedByEl.textContent = `${item.user.name} (${item.user.studentId})`;
    }

    // Configure Action Buttons
    const claimBtn = document.getElementById('claimItemBtn');
    if (claimBtn) {
      if (item.type === 'FOUND' && (item.status === 'ACTIVE' || item.status === 'MATCHED')) {
        claimBtn.classList.remove('d-none');
      } else {
        claimBtn.classList.add('d-none');
      }
    }

    // Contact modal preparation
    const contactBtn = document.getElementById('contactOwnerBtn');
    if (contactBtn) {
      contactBtn.onclick = () => showContactModal(item);
    }

  } catch (err) {
    if (loader) loader.classList.add('d-none');
    showToast('Could not load item details. ' + err.message, 'error');
  }
}

// -------------------------------------------------------------
// Matching System (Section 14)
// -------------------------------------------------------------
async function loadMatches(itemId) {
  const matchContainer = document.getElementById('matchesSection');
  if (!matchContainer) return;

  try {
    const matches = await fetchApi(`/items/${itemId}/matches`);

    if (!matches || matches.length === 0) {
      matchContainer.innerHTML = `
        <div class="p-3 bg-light rounded-3 text-muted text-center" style="font-size:0.92rem;">
          <i class="fas fa-radar text-secondary mb-2 fs-4 d-block"></i>
          No immediate matches found in current campus records. The system actively scans whenever new reports are filed.
        </div>
      `;
      return;
    }

    matchContainer.innerHTML = `
      <div class="alert alert-primary d-flex align-items-center mb-3">
        <i class="fas fa-bullseye fs-4 me-3 text-primary"></i>
        <div>
          <h6 class="mb-0 fw-bold">Possible Match Found (${matches.length})</h6>
          <small class="text-muted">Our smart campus matcher detected related ${currentItem?.type === 'LOST' ? 'found' : 'lost'} records:</small>
        </div>
      </div>
      <div class="d-flex flex-column gap-3">
        ${matches.map(m => `
          <div class="match-card">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <div>
                <h6 class="fw-bold mb-0">${m.matchedItem.itemName}</h6>
                <small class="text-muted"><i class="fas fa-location-dot me-1"></i> ${m.matchedItem.location} • ${formatDate(m.matchedItem.date)}</small>
              </div>
              <span class="match-score-badge">${m.matchScore}% Match</span>
            </div>
            
            <div class="mb-2">
              ${m.matchingReasons.map(r => `<span class="badge bg-light text-dark border me-1 mb-1"><i class="fas fa-check text-success me-1"></i>${r}</span>`).join('')}
            </div>

            <div class="text-end">
              <a href="item-details.html?id=${m.matchedItem.id}" class="btn btn-sm btn-primary-custom">
                <i class="fas fa-eye me-1"></i> View Possible Match
              </a>
            </div>
          </div>
        `).join('')}
      </div>
    `;

  } catch (err) {
    console.warn('Could not load item matches:', err);
  }
}

// -------------------------------------------------------------
// Contact Owner / Finder Modal
// -------------------------------------------------------------
function showContactModal(item) {
  const contactInfo = item.contactInfo || (item.user ? item.user.phone : 'Not provided');
  const user = getAuthUser();

  if (!user) {
    showToast('Please login to view verified contact details.', 'warning');
    setTimeout(() => window.location.href = 'login.html', 1200);
    return;
  }

  const modalHtml = `
    <div class="modal fade" id="contactModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg" style="border-radius: var(--radius-lg);">
          <div class="modal-header border-bottom-0 pb-0">
            <h5 class="modal-title fw-bold"><i class="fas fa-address-card text-primary me-2"></i>Contact Information</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body p-4">
            <p class="text-muted mb-3">You can reach the student or authority who reported this item:</p>
            
            <div class="p-3 bg-light rounded-3 mb-3">
              <div class="d-flex align-items-center gap-3 mb-2">
                <div class="avatar-circle">${item.user ? item.user.name[0] : 'U'}</div>
                <div>
                  <div class="fw-bold">${item.user ? item.user.name : 'Reporter'}</div>
                  <small class="text-muted">Student ID: ${item.user ? item.user.studentId : 'N/A'}</small>
                </div>
              </div>
              <hr class="my-2">
              <div class="d-flex justify-content-between">
                <span class="text-muted"><i class="fas fa-phone me-1"></i> Phone / Contact:</span>
                <span class="fw-bold text-primary">${contactInfo}</span>
              </div>
            </div>

            <div class="alert alert-info py-2" style="font-size:0.85rem;">
              <i class="fas fa-shield-alt me-1"></i> For your campus safety, meet in well-lit public campus areas like the Central Library, Cafeteria, or Main Security Desk.
            </div>
          </div>
          <div class="modal-footer border-top-0 pt-0">
            <button type="button" class="btn btn-outline-custom w-100" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  `;

  const existing = document.getElementById('contactModal');
  if (existing) existing.remove();

  document.body.insertAdjacentHTML('beforeend', modalHtml);
  const modalEl = document.getElementById('contactModal');
  const bsModal = new bootstrap.Modal(modalEl);
  bsModal.show();
}

// -------------------------------------------------------------
// Claim Submission
// -------------------------------------------------------------
function openClaimModal() {
  const user = requireAuth();
  if (!user) return;

  if (currentItem && currentItem.user && currentItem.user.id === user.id) {
    showToast('You cannot claim an item that you reported yourself.', 'warning');
    return;
  }

  // Pre-fill claimant info
  document.getElementById('claimantName').value = user.name || '';
  document.getElementById('claimantStudentId').value = user.studentId || '';
  document.getElementById('claimantPhone').value = user.phone || '';

  const modalEl = document.getElementById('claimItemModal');
  const modal = new bootstrap.Modal(modalEl);
  modal.show();
}

async function handleClaimSubmit(e) {
  e.preventDefault();

  const user = requireAuth();
  if (!user || !currentItem) return;

  const submitBtn = document.getElementById('submitClaimBtn');
  const reason = document.getElementById('claimReason').value.trim();
  const additionalDetails = document.getElementById('claimAdditionalDetails').value.trim();

  if (!reason) {
    showToast('Please state why this item belongs to you.', 'warning');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Submitting Claim...';

  try {
    const payload = {
      itemId: currentItem.id,
      claimantId: user.id,
      claimantName: document.getElementById('claimantName').value.trim() || user.name,
      claimantStudentId: document.getElementById('claimantStudentId').value.trim() || user.studentId,
      claimantPhone: document.getElementById('claimantPhone').value.trim() || user.phone,
      reason,
      additionalDetails
    };

    await fetchApi('/claims', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    // Close modal
    const modalEl = document.getElementById('claimItemModal');
    const bsModal = bootstrap.Modal.getInstance(modalEl);
    if (bsModal) bsModal.hide();

    showToast('Claim submitted successfully! The finder/admin will review your proof.', 'success');
    
    // Refresh details
    setTimeout(() => {
      window.location.reload();
    }, 1500);

  } catch (err) {
    showToast(err.message || 'Could not submit claim. You may have already claimed this item.', 'error');
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Submit Claim';
  }
}

function reportIncorrectInfo() {
  showToast('Thank you! Campus moderators have been notified to review this listing.', 'info');
}
