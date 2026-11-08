/**
 * Report Lost & Found Items Form Handler
 * Campus Lost & Found Portal
 */

document.addEventListener('DOMContentLoaded', () => {
  const lostForm = document.getElementById('reportLostForm');
  if (lostForm) {
    lostForm.addEventListener('submit', (e) => handleReportSubmit(e, 'LOST'));
  }

  const foundForm = document.getElementById('reportFoundForm');
  if (foundForm) {
    foundForm.addEventListener('submit', (e) => handleReportSubmit(e, 'FOUND'));
  }

  // Pre-fill user contact info if logged in
  const user = getAuthUser();
  if (user) {
    const contactInput = document.getElementById('contactInfo');
    if (contactInput && !contactInput.value) {
      contactInput.value = user.phone || user.email;
    }
  }

  // Set default date to today
  const dateInput = document.getElementById('itemDate');
  if (dateInput && !dateInput.value) {
    dateInput.value = new Date().toISOString().split('T')[0];
  }
});

async function handleReportSubmit(e, reportType) {
  e.preventDefault();

  const user = requireAuth();
  if (!user) return;

  const submitBtn = document.getElementById('submitReportBtn');
  const originalBtnText = submitBtn.innerHTML;

  // Retrieve form fields
  const itemName = document.getElementById('itemName').value.trim();
  const category = document.getElementById('category').value;
  const description = document.getElementById('description').value.trim();
  const itemDate = document.getElementById('itemDate').value;
  const itemTime = document.getElementById('itemTime').value.trim();
  const location = document.getElementById('location').value.trim();
  const color = document.getElementById('color').value.trim();
  const brand = document.getElementById('brand').value.trim();
  const identifyingDetails = document.getElementById('identifyingDetails').value.trim();
  const contactInfo = document.getElementById('contactInfo')?.value.trim() || user.phone;
  const currentLocation = document.getElementById('currentLocation')?.value.trim() || '';

  const imageFileInput = document.getElementById('imageFile');
  const imageUrlInput = document.getElementById('imageUrl');
  let imageUrl = imageUrlInput ? imageUrlInput.value.trim() : '';

  // Validation
  if (!itemName || !category || !location) {
    showToast('Please fill in all required fields (Item Name, Category, Location).', 'warning');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Submitting Report...';

  try {
    // 1. If an image file is attached, upload it first
    if (imageFileInput && imageFileInput.files.length > 0) {
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Uploading Photo...';
      const fileData = new FormData();
      fileData.append('file', imageFileInput.files[0]);

      try {
        const uploadRes = await fetchApi('/upload', {
          method: 'POST',
          body: fileData
        });
        if (uploadRes && uploadRes.imageUrl) {
          imageUrl = uploadRes.imageUrl;
        }
      } catch (uploadErr) {
        console.warn('Image upload failed, proceeding without custom photo:', uploadErr);
        showToast('Image upload failed; report will use default category visual.', 'warning');
      }
    }

    // 2. Submit the Item Report
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Saving to Database...';

    const payload = {
      itemName,
      type: reportType,
      category,
      description,
      date: itemDate || null,
      time: itemTime || null,
      location,
      color,
      brand,
      identifyingDetails,
      currentLocation,
      contactInfo,
      imageUrl,
      userId: user.id
    };

    const endpoint = reportType === 'LOST' ? '/items/lost' : '/items/found';
    const createdItem = await fetchApi(endpoint, {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    // 3. Show Success Modal with Report ID and matching prompt
    showReportSuccessModal(createdItem);

  } catch (err) {
    showToast(err.message || 'Failed to submit report. Please try again.', 'error');
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;
  }
}

function showReportSuccessModal(item) {
  const modalHtml = `
    <div class="modal fade" id="reportSuccessModal" data-bs-backdrop="static" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg" style="border-radius: var(--radius-lg);">
          <div class="modal-body p-4 text-center">
            <div class="rounded-circle bg-success bg-opacity-10 d-inline-flex align-items-center justify-content-center p-3 mb-3 text-success" style="width:72px; height:72px;">
              <i class="fas fa-check-circle fs-1"></i>
            </div>
            <h4 class="fw-bold mb-1">Report Filed Successfully!</h4>
            <p class="text-muted mb-3">Your ${item.type.toLowerCase()} item report has been recorded in the campus database.</p>
            
            <div class="p-3 bg-light rounded-3 text-start mb-4">
              <div class="d-flex justify-content-between mb-1">
                <span class="text-muted">Report ID:</span>
                <span class="fw-bold text-primary">#RPT-${item.id}</span>
              </div>
              <div class="d-flex justify-content-between mb-1">
                <span class="text-muted">Item Name:</span>
                <span class="fw-semibold">${item.itemName}</span>
              </div>
              <div class="d-flex justify-content-between mb-1">
                <span class="text-muted">Type:</span>
                <span class="badge ${item.type === 'LOST' ? 'bg-danger' : 'bg-success'}">${item.type}</span>
              </div>
              <div class="d-flex justify-content-between">
                <span class="text-muted">Status:</span>
                <span class="badge bg-success">ACTIVE</span>
              </div>
            </div>

            <div class="d-flex flex-column gap-2">
              <a href="item-details.html?id=${item.id}" class="btn btn-primary-custom w-100 justify-content-center">
                <i class="fas fa-link me-2"></i> View Item & Check Matches
              </a>
              <a href="browse.html" class="btn btn-outline-custom w-100 justify-content-center">
                <i class="fas fa-list me-2"></i> Browse All Campus Items
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const existing = document.getElementById('reportSuccessModal');
  if (existing) existing.remove();

  document.body.insertAdjacentHTML('beforeend', modalHtml);
  const modalEl = document.getElementById('reportSuccessModal');
  const bsModal = new bootstrap.Modal(modalEl);
  bsModal.show();
}
