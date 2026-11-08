/**
 * Browse & Search Page Controller
 * Campus Lost & Found Portal
 */

let currentItems = [];

document.addEventListener('DOMContentLoaded', () => {
  // Read any initial query parameters
  const params = new URLSearchParams(window.location.search);
  const typeParam = params.get('type');
  const catParam = params.get('category');
  const queryParam = params.get('q');

  if (typeParam) {
    const radio = document.querySelector(`input[name="filterType"][value="${typeParam.toUpperCase()}"]`);
    if (radio) radio.checked = true;
  }
  if (catParam) {
    const catSelect = document.getElementById('filterCategory');
    if (catSelect) catSelect.value = catParam;
  }
  if (queryParam) {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = queryParam;
  }

  // Bind Event Listeners
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', debounce(performSearch, 300));
  }

  const filterCategory = document.getElementById('filterCategory');
  if (filterCategory) {
    filterCategory.addEventListener('change', performSearch);
  }

  const filterStatus = document.getElementById('filterStatus');
  if (filterStatus) {
    filterStatus.addEventListener('change', performSearch);
  }

  const filterLocation = document.getElementById('filterLocation');
  if (filterLocation) {
    filterLocation.addEventListener('input', debounce(performSearch, 300));
  }

  const typeRadios = document.querySelectorAll('input[name="filterType"]');
  typeRadios.forEach(r => r.addEventListener('change', performSearch));

  // Initial load
  performSearch();
});

function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

async function performSearch() {
  const container = document.getElementById('itemsGrid');
  const countSpan = document.getElementById('resultsCount');
  const emptyState = document.getElementById('emptyState');
  const loader = document.getElementById('searchLoader');

  if (loader) loader.classList.remove('d-none');
  if (emptyState) emptyState.classList.add('d-none');

  const keyword = document.getElementById('searchInput')?.value.trim() || '';
  const category = document.getElementById('filterCategory')?.value || '';
  const status = document.getElementById('filterStatus')?.value || '';
  const location = document.getElementById('filterLocation')?.value.trim() || '';
  
  const checkedTypeRadio = document.querySelector('input[name="filterType"]:checked');
  const type = checkedTypeRadio ? checkedTypeRadio.value : '';

  try {
    const queryParams = new URLSearchParams();
    if (keyword) queryParams.set('keyword', keyword);
    if (category && category !== 'ALL') queryParams.set('category', category);
    if (status && status !== 'ALL') queryParams.set('status', status);
    if (location) queryParams.set('location', location);
    if (type && type !== 'ALL') queryParams.set('type', type);

    const items = await fetchApi(`/items/search?${queryParams.toString()}`);
    currentItems = items;

    if (loader) loader.classList.add('d-none');

    if (countSpan) {
      countSpan.textContent = `${items.length} item${items.length === 1 ? '' : 's'} found`;
    }

    if (!items || items.length === 0) {
      container.innerHTML = '';
      if (emptyState) emptyState.classList.remove('d-none');
      return;
    }

    renderItems(items);
  } catch (err) {
    if (loader) loader.classList.add('d-none');
    showToast('Failed to load items. ' + err.message, 'error');
  }
}

function renderItems(items) {
  const container = document.getElementById('itemsGrid');
  if (!container) return;

  const defaultImages = {
    'Electronics': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    'Books': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    'ID Cards': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    'Accessories': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    'Bags': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    'Keys': 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop&q=80',
    'Documents': 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80',
    'Clothing': 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
    'Other': 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=80'
  };

  container.innerHTML = items.map(item => {
    const isLost = item.type === 'LOST';
    const typeBadge = isLost 
      ? '<span class="item-badge-type badge-lost"><i class="fas fa-search me-1"></i> LOST</span>' 
      : '<span class="item-badge-type badge-found"><i class="fas fa-check-circle me-1"></i> FOUND</span>';

    const fallbackImg = defaultImages[item.category] || defaultImages['Other'];
    const displayImg = item.imageUrl && item.imageUrl.trim() ? item.imageUrl : fallbackImg;

    return `
      <div class="col-md-6 col-lg-4 mb-4">
        <div class="item-card shadow-sm">
          <div class="item-card-image-wrap">
            <img src="${displayImg}" alt="${item.itemName}" class="item-card-img" onerror="this.src='${fallbackImg}'">
            ${typeBadge}
            <span class="item-badge-category">${item.category}</span>
          </div>
          <div class="item-card-body">
            <h5 class="item-card-title" title="${item.itemName}">${item.itemName}</h5>
            
            <div class="item-meta-row">
              <i class="fas fa-location-dot text-primary"></i>
              <span class="text-truncate">${item.location}</span>
            </div>
            
            <div class="item-meta-row">
              <i class="fas fa-calendar-day text-muted"></i>
              <span>${formatDate(item.date)} ${item.time ? '• ' + item.time : ''}</span>
            </div>

            <p class="item-card-desc">${item.description || 'No additional description provided.'}</p>

            <div class="item-card-footer">
              <div>
                ${getStatusBadge(item.status)}
              </div>
              <a href="item-details.html?id=${item.id}" class="btn btn-sm btn-outline-custom">
                View Details <i class="fas fa-arrow-right ms-1"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function resetFilters() {
  document.getElementById('searchInput').value = '';
  document.getElementById('filterCategory').value = 'ALL';
  document.getElementById('filterStatus').value = 'ALL';
  document.getElementById('filterLocation').value = '';
  const allRadio = document.querySelector('input[name="filterType"][value="ALL"]');
  if (allRadio) allRadio.checked = true;
  performSearch();
}
