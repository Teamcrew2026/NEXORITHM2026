/**
 * Nexorithm 2026 - Admin Portal & Registration Management Module
 */

class NexAdmin {
  constructor() {
    this.isAuthenticated = false;
    this.allRegistrations = [];
    this.filteredRegistrations = [];
    this.currentSearchTerm = '';
    this.currentEventFilter = 'all';
    this.currentCollegeFilter = 'all';
    this.init();
  }

  init() {
    this.checkSession();
    this.bindEvents();
  }

  async checkSession() {
    try {
      const headers = {};
      const token = localStorage.getItem('nex_admin_token');
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/admin/session', { headers, credentials: 'include' });
      const payload = await res.json();
      if (payload.authenticated) {
        this.isAuthenticated = true;
        this.adminUsername = payload.username || '';
        this.showDashboard();
      } else {
        this.isAuthenticated = false;
        this.showLoginGate();
      }
    } catch (err) {
      console.error('Session check failed:', err);
      this.isAuthenticated = false;
      this.showLoginGate();
    }
  }

  bindEvents() {
    // Login Form Submit
    const loginForm = document.getElementById('admin-login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const user = document.getElementById('admin-username')?.value.trim();
        const pass = document.getElementById('admin-password')?.value;
        const errEl = document.getElementById('admin-login-error');
        const submitBtn = loginForm.querySelector('button[type="submit"]');

        if (submitBtn) submitBtn.disabled = true;

        try {
          const res = await fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: user, password: pass }),
            credentials: 'include'
          });
          const payload = await res.json();

          if (res.ok && payload.success) {
            this.isAuthenticated = true;
            this.adminUsername = payload.username || '';
            if (payload.token) {
              localStorage.setItem('nex_admin_token', payload.token);
            }
            if (errEl) errEl.classList.add('hidden');
            this.showDashboard();
            if (window.nexRegistration) {
              window.nexRegistration.showToast('Welcome Administrator! Session authenticated.', 'success');
            }
          } else if (errEl) {
            errEl.textContent = payload.message || 'Invalid username or password.';
            errEl.classList.remove('hidden');
          }
        } catch (err) {
          console.error('Login failed:', err);
          if (errEl) {
            errEl.textContent = 'Could not reach the server. Please try again.';
            errEl.classList.remove('hidden');
          }
        } finally {
          if (submitBtn) submitBtn.disabled = false;
        }
      });
    }

    // Logout
    const logoutBtn = document.getElementById('btn-admin-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        try {
          await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' });
        } catch (err) {
          console.error('Logout request failed:', err);
        }
        localStorage.removeItem('nex_admin_token');
        this.isAuthenticated = false;
        this.showLoginGate();
        if (window.nexRegistration) {
          window.nexRegistration.showToast('Logged out of Admin Dashboard.', 'info');
        }
      });
    }

    // Search input
    const searchInput = document.getElementById('admin-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.currentSearchTerm = e.target.value.toLowerCase().trim();
        this.applyFilters();
      });
    }

    // Filter event dropdown
    const eventSelect = document.getElementById('admin-filter-event');
    if (eventSelect) {
      eventSelect.addEventListener('change', (e) => {
        this.currentEventFilter = e.target.value;
        this.applyFilters();
      });
    }

    // Filter college dropdown
    const collegeSelect = document.getElementById('admin-filter-college');
    if (collegeSelect) {
      collegeSelect.addEventListener('change', (e) => {
        this.currentCollegeFilter = e.target.value;
        this.applyFilters();
      });
    }

    // Export CSV
    const exportBtn = document.getElementById('btn-export-csv');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportCSV());
    }

    // Seed Sample Data
    const seedBtn = document.getElementById('btn-seed-data');
    if (seedBtn) {
      seedBtn.addEventListener('click', async () => {
        if (confirm('Load sample test delegate registrations?')) {
          await window.nexStorage.seedInitialDataIfEmpty();
          await this.loadData();
          if (window.nexRegistration) {
            window.nexRegistration.showToast('Sample registration data refreshed!', 'success');
          }
        }
      });
    }

    // Spot Registration Form Submit
    const spotForm = document.getElementById('spot-reg-form');
    if (spotForm) {
      spotForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.handleSpotRegistration(e);
      });
    }
  }

  showLoginGate() {
    const gate = document.getElementById('admin-login-gate');
    const dash = document.getElementById('admin-dashboard-view');
    if (gate) gate.classList.remove('hidden');
    if (dash) dash.classList.add('hidden');
  }

  async showDashboard() {
    const gate = document.getElementById('admin-login-gate');
    const dash = document.getElementById('admin-dashboard-view');
    if (gate) gate.classList.add('hidden');
    if (dash) dash.classList.remove('hidden');

    await this.loadData();
  }

  async loadData() {
    const tbody = document.getElementById('admin-table-body');
    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center py-8 text-slate-400">
            <div class="inline-flex items-center gap-3">
              <span class="spinner-border spinner-border-sm"></span> Loading registrations...
            </div>
          </td>
        </tr>
      `;
    }

    try {
      this.allRegistrations = await window.nexStorage.getAllRegistrations();
      this.populateCollegeFilter();
      this.applyFilters();
      this.updateStats();
    } catch (err) {
      console.error('Failed to load registrations:', err);
      if (String(err.message || '').includes('authentication')) {
        // Session expired server-side — bounce back to the login gate.
        this.isAuthenticated = false;
        this.showLoginGate();
        return;
      }
      if (tbody) {
        tbody.innerHTML = `
          <tr>
            <td colspan="7" class="text-center py-8 text-slate-400">
              Could not load registrations: ${err.message || 'Unknown error'}
            </td>
          </tr>
        `;
      }
    }
  }

  populateCollegeFilter() {
    const collegeSelect = document.getElementById('admin-filter-college');
    if (!collegeSelect) return;

    const colleges = Array.from(new Set(this.allRegistrations.map((r) => r.college))).filter(Boolean);
    let options = '<option value="all">All Colleges / Institutions</option>';
    colleges.forEach((c) => {
      options += `<option value="${c}">${c}</option>`;
    });
    collegeSelect.innerHTML = options;
  }

  applyFilters() {
    let list = [...this.allRegistrations];

    if (this.currentSearchTerm) {
      list = list.filter((r) => {
        const text = `${r.id} ${r.fullName} ${r.email} ${r.phone} ${r.college} ${r.transactionId}`.toLowerCase();
        return text.includes(this.currentSearchTerm);
      });
    }

    if (this.currentEventFilter !== 'all') {
      list = list.filter((r) => r.events && r.events.includes(this.currentEventFilter));
    }

    if (this.currentCollegeFilter !== 'all') {
      list = list.filter((r) => r.college === this.currentCollegeFilter);
    }

    this.filteredRegistrations = list;
    this.renderTable();
  }

  renderTable() {
    const tbody = document.getElementById('admin-table-body');
    const countDisplay = document.getElementById('admin-filtered-count');
    if (!tbody) return;

    if (countDisplay) {
      countDisplay.textContent = `Showing ${this.filteredRegistrations.length} of ${this.allRegistrations.length} delegates`;
    }

    if (this.filteredRegistrations.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center py-10 text-slate-400">
            <i data-lucide="search-x" class="w-8 h-8 mx-auto mb-2 text-slate-500"></i>
            No registration records found matching the filter criteria.
          </td>
        </tr>
      `;
      if (window.lucide) lucide.createIcons();
      return;
    }

    let rowsHtml = '';
    this.filteredRegistrations.forEach((reg) => {
      const eventBadges = reg.events.map((evId) => {
        const ev = EVENTS_DATA.find((e) => e.id === evId);
        const name = ev ? ev.title : evId;
        const color = ev && ev.category === 'technical' ? 'badge-cyan' : 'badge-purple';
        return `<span class="badge ${color} text-[10px] mr-1 mb-1">${name}</span>`;
      }).join('');

      const verifiedBadge = reg.paymentVerified
        ? `<span class="badge badge-emerald text-[11px]"><i data-lucide="check-circle" class="w-3 h-3 inline mr-1"></i>Verified</span>`
        : `<span class="badge badge-amber text-[11px]"><i data-lucide="clock" class="w-3 h-3 inline mr-1"></i>Pending</span>`;

      const dateStr = new Date(reg.timestamp).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });

      rowsHtml += `
        <tr class="admin-table-row">
          <td class="font-mono text-brand-cyan font-bold whitespace-nowrap">${reg.id}</td>
          <td>
            <div class="font-semibold text-white">${reg.fullName}</div>
            <div class="text-xs text-slate-400 font-mono">${reg.email} • ${reg.phone}</div>
          </td>
          <td>
            <div class="text-xs text-slate-300 max-w-[200px] truncate" title="${reg.college}">${reg.college}</div>
            <div class="text-[11px] text-slate-500">${reg.dept} (${reg.year})</div>
          </td>
          <td>
            <div class="flex flex-wrap max-w-[220px]">${eventBadges}</div>
          </td>
          <td>
            <div class="font-mono font-bold text-white">₹${reg.amount}</div>
            <div class="text-[11px] text-slate-400 font-mono truncate max-w-[120px]" title="${reg.transactionId}">${reg.transactionId}</div>
            <div class="mt-1">${verifiedBadge}</div>
          </td>
          <td class="text-xs text-slate-400 whitespace-nowrap">${dateStr}</td>
          <td class="whitespace-nowrap">
            <div class="flex items-center gap-1.5">
              <button class="btn-action-icon" title="View Payment Proof & Details" onclick="window.nexAdmin.viewEntryDetails('${reg.id}')">
                <i data-lucide="eye" class="w-4 h-4 text-cyan-400"></i>
              </button>
              <button class="btn-action-icon" title="Toggle Payment Verification" onclick="window.nexAdmin.toggleVerify('${reg.id}')">
                <i data-lucide="shield-check" class="w-4 h-4 text-emerald-400"></i>
              </button>
              <button class="btn-action-icon" title="Delete Registration" onclick="window.nexAdmin.deleteEntry('${reg.id}')">
                <i data-lucide="trash-2" class="w-4 h-4 text-rose-400"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    });

    tbody.innerHTML = rowsHtml;
    if (window.lucide) lucide.createIcons();
  }

  updateStats() {
    const totalRegs = this.allRegistrations.length;
    let totalRevenue = 0;
    const collegesSet = new Set();
    let techCount = 0;
    let nonTechCount = 0;

    this.allRegistrations.forEach((r) => {
      totalRevenue += Number(r.amount) || 0;
      if (r.college) collegesSet.add(r.college);
      if (r.events) {
        r.events.forEach((evId) => {
          const ev = EVENTS_DATA.find((e) => e.id === evId);
          if (ev && ev.category === 'technical') techCount++;
          else if (ev && ev.category === 'non-technical') nonTechCount++;
        });
      }
    });

    const statTotalEl = document.getElementById('stat-total-regs');
    const statRevenueEl = document.getElementById('stat-total-revenue');
    const statCollegesEl = document.getElementById('stat-total-colleges');
    const statEventsEl = document.getElementById('stat-event-breakdown');

    if (statTotalEl) statTotalEl.textContent = totalRegs;
    if (statRevenueEl) statRevenueEl.textContent = `₹${totalRevenue.toLocaleString('en-IN')}`;
    if (statCollegesEl) statCollegesEl.textContent = collegesSet.size;
    if (statEventsEl) statEventsEl.textContent = `${techCount} Tech / ${nonTechCount} Non-Tech`;
  }

  async viewEntryDetails(id) {
    const record = this.allRegistrations.find((r) => r.id === id);
    if (!record) return;

    const modal = document.getElementById('admin-detail-modal');
    if (!modal) return;

    const eventNames = record.events.map((evId) => {
      const ev = EVENTS_DATA.find((e) => e.id === evId);
      return ev ? ev.title : evId;
    }).join(', ');

    document.getElementById('modal-detail-id').textContent = record.id;
    document.getElementById('modal-detail-name').textContent = record.fullName;
    document.getElementById('modal-detail-email').textContent = record.email;
    document.getElementById('modal-detail-phone').textContent = record.phone;
    document.getElementById('modal-detail-college').textContent = record.college;
    document.getElementById('modal-detail-dept').textContent = `${record.dept} (${record.year})`;
    document.getElementById('modal-detail-events').textContent = eventNames;
    document.getElementById('modal-detail-amount').textContent = `₹${record.amount}`;
    document.getElementById('modal-detail-utr').textContent = record.transactionId;
    const foodDetailEl = document.getElementById('modal-detail-food');
    if (foodDetailEl) foodDetailEl.textContent = record.foodPreference === 'Non-Vegetarian' ? '🍗 Non-Vegetarian' : '🥦 Vegetarian';

    const imgContainer = document.getElementById('modal-detail-screenshot-container');
    const imgEl = document.getElementById('modal-detail-screenshot-img');
    const noImgEl = document.getElementById('modal-detail-no-screenshot');

    if (record.screenshot) {
      imgEl.src = record.screenshot;
      imgContainer.classList.remove('hidden');
      noImgEl.classList.add('hidden');
    } else {
      imgContainer.classList.add('hidden');
      noImgEl.classList.remove('hidden');
    }

    modal.classList.add('is-open');
    if (window.lucide) lucide.createIcons();
  }

  async toggleVerify(id) {
    const record = this.allRegistrations.find((r) => r.id === id);
    if (!record) return;

    try {
      await window.nexStorage.updateVerification(id, !record.paymentVerified);
      await this.loadData();
      if (window.nexRegistration) {
        window.nexRegistration.showToast(`Updated payment status for ${record.fullName}`, 'success');
      }
    } catch (err) {
      console.error(err);
      if (window.nexRegistration) {
        window.nexRegistration.showToast(err.message || 'Could not update payment status.', 'error');
      }
    }
  }

  async deleteEntry(id) {
    if (confirm(`Are you sure you want to permanently delete registration ${id}?`)) {
      try {
        await window.nexStorage.deleteRegistration(id);
        await this.loadData();
        if (window.nexRegistration) {
          window.nexRegistration.showToast(`Registration ${id} deleted successfully.`, 'info');
        }
      } catch (err) {
        console.error(err);
        if (window.nexRegistration) {
          window.nexRegistration.showToast(err.message || 'Could not delete registration.', 'error');
        }
      }
    }
  }

  exportCSV() {
    if (this.allRegistrations.length === 0) {
      alert('No registration data available to export.');
      return;
    }

    const headers = [
      'Registration ID',
      'Full Name',
      'College',
      'Department',
      'Year',
      'Email',
      'Phone',
      'Selected Events',
      'Amount (INR)',
      'Transaction ID (UTR)',
      'Payment Status',
      'Timestamp'
    ];

    const rows = this.allRegistrations.map((r) => [
      `"${r.id}"`,
      `"${r.fullName}"`,
      `"${r.college}"`,
      `"${r.dept}"`,
      `"${r.year}"`,
      `"${r.email}"`,
      `"${r.phone}"`,
      `"${r.events ? r.events.join(', ') : ''}"`,
      r.amount || 0,
      `"${r.transactionId}"`,
      r.paymentVerified ? 'Verified' : 'Pending',
      `"${new Date(r.timestamp).toLocaleString('en-IN')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Nexorithm_2026_Delegates_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (window.nexRegistration) {
      window.nexRegistration.showToast('CSV Export generated and downloaded successfully!', 'success');
    }
  }

  async handleSpotRegistration(e) {
    const name = document.getElementById('spot-name')?.value.trim();
    const college = document.getElementById('spot-college')?.value.trim();
    const dept = document.getElementById('spot-dept')?.value.trim();
    const email = document.getElementById('spot-email')?.value.trim();
    const phone = document.getElementById('spot-phone')?.value.trim();
    const eventId = document.getElementById('spot-event')?.value;
    const amount = Number(document.getElementById('spot-amount')?.value) || 250;
    const utr = document.getElementById('spot-utr')?.value.trim() || 'CASH/SPOT-ENTRY';
    const foodPreference = document.getElementById('spot-food')?.value || 'Vegetarian';

    if (!name || !college || !email || !phone) {
      alert('Please fill required fields.');
      return;
    }

    const regId = 'NX-SPOT-' + Math.floor(1000 + Math.random() * 9000);
    const newEntry = {
      id: regId,
      fullName: name,
      college,
      dept: dept || 'CSE',
      year: 'Spot Entry',
      email,
      phone,
      events: [eventId],
      teamSize: 1,
      teamMembers: [name],
      amount,
      foodPreference,
      paymentMethod: 'Cash / Spot QR',
      transactionId: utr,
      screenshot: '',
      paymentVerified: true,
      timestamp: new Date().toISOString()
    };

    try {
      await window.nexStorage.saveRegistration(newEntry);
      await this.loadData();
      e.target.reset();
      window.closeSpotModal();
      if (window.nexRegistration) {
        window.nexRegistration.showToast(`Spot delegate ${regId} registered!`, 'success');
      }
    } catch (err) {
      console.error(err);
      if (window.nexRegistration) {
        window.nexRegistration.showToast(err.message || 'Could not save spot registration.', 'error');
      }
    }
  }
}

window.checkAdminAuth = function() {
  if (!window.nexAdmin) {
    window.nexAdmin = new NexAdmin();
  } else {
    window.nexAdmin.checkSession();
  }
};

window.closeAdminDetailModal = function() {
  const modal = document.getElementById('admin-detail-modal');
  if (modal) modal.classList.remove('is-open');
};

window.openSpotModal = function() {
  const modal = document.getElementById('spot-modal');
  if (modal) {
    const eventSelect = document.getElementById('spot-event');
    if (eventSelect) {
      let options = '';
      EVENTS_DATA.forEach((ev) => {
        options += `<option value="${ev.id}">${ev.title} (${ev.category})</option>`;
      });
      eventSelect.innerHTML = options;
    }
    modal.classList.add('is-open');
    if (window.lucide) lucide.createIcons();
  }
};

window.closeSpotModal = function() {
  const modal = document.getElementById('spot-modal');
  if (modal) modal.classList.remove('is-open');
};
