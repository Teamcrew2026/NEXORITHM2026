/**
 * Nexorithm 2026 - Registration & UPI Payment Processing Module
 */

class NexRegistration {
  constructor() {
    this.selectedEvents = new Set();
    this.uploadedScreenshotBase64 = '';
    this.baseFee = 250;
    this.comboFee = 250;
    this.currentTotal = 250;
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    // Event selection change listener (Exactly 1 technical + 1 non-technical per participant)
    document.addEventListener('change', (e) => {
      if (e.target.matches('.event-checkbox')) {
        const eventId = e.target.value;
        const eventObj = EVENTS_DATA.find((ev) => ev.id === eventId);

        if (e.target.checked) {
          // Block a 2nd event from the same category (technical/non-technical)
          const sameCategoryTaken = eventObj && Array.from(this.selectedEvents).some((id) => {
            const existing = EVENTS_DATA.find((ev) => ev.id === id);
            return existing && existing.category === eventObj.category;
          });

          if (sameCategoryTaken) {
            e.target.checked = false;
            this.showToast(`You already picked a ${eventObj.category} event. Choose 1 Technical + 1 Non-Technical only.`, 'error');
            return;
          }

          if (this.selectedEvents.size >= 2) {
            e.target.checked = false;
            const parentCard = e.target.closest('.event-check-card');
            if (parentCard) parentCard.classList.remove('is-selected');
            this.showToast('Each participant must select exactly 2 events: one technical and one non-technical.', 'error');
            return;
          }
          this.selectedEvents.add(eventId);
        } else {
          this.selectedEvents.delete(eventId);
        }
        this.updateEventCheckboxesState();
        this.updateFeeCalculation();
      }
    });

    // Screenshot file upload & preview
    const fileInput = document.getElementById('reg-screenshot');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
    }

    // Drag and drop for screenshot
    const dropArea = document.getElementById('screenshot-dropzone');
    if (dropArea) {
      ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, (e) => {
          e.preventDefault();
          dropArea.classList.add('is-dragover');
        }, false);
      });
      ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, (e) => {
          e.preventDefault();
          dropArea.classList.remove('is-dragover');
        }, false);
      });
      dropArea.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files && files.length > 0) {
          this.processScreenshotFile(files[0]);
        }
      });
    }

    // Copy UPI ID button
    const copyUpiBtn = document.getElementById('btn-copy-upi');
    if (copyUpiBtn) {
      copyUpiBtn.addEventListener('click', () => {
        const upiId = 'harshinibala30@oksbi';
        navigator.clipboard.writeText(upiId).then(() => {
          this.showToast('UPI ID copied to clipboard! (harshinibala30@oksbi)', 'success');
        });
      });
    }

    // Main registration form submit
    const form = document.getElementById('registration-form');
    if (form) {
      form.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }

    // Food preference card interactive selection
    document.addEventListener('change', (e) => {
      if (e.target.matches('input[name="reg-food"]')) {
        document.querySelectorAll('.food-pref-card').forEach(card => card.classList.remove('is-selected'));
        const parentCard = e.target.closest('.food-pref-card');
        if (parentCard) parentCard.classList.add('is-selected');
      }
    });
  }

  handleFileUpload(e) {
    const file = e.target.files[0];
    if (file) {
      this.processScreenshotFile(file);
    }
  }

  processScreenshotFile(file) {
    if (!file.type.startsWith('image/')) {
      this.showToast('Please upload an image file (PNG, JPG, JPEG, WEBP)', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      this.showToast('Image size exceeds 10MB limit. Please use a smaller image.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Resize image to stay below 1 Megapixel (1,000,000 total pixels)
        const MAX_PIXELS = 1_000_000;
        let width = img.width;
        let height = img.height;
        const totalPixels = width * height;

        if (totalPixels > MAX_PIXELS) {
          const scale = Math.sqrt(MAX_PIXELS / totalPixels);
          width = Math.floor(width * scale);
          height = Math.floor(height * scale);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Compress to JPEG at 60% quality to keep file size small
        this.uploadedScreenshotBase64 = canvas.toDataURL('image/jpeg', 0.6);

        const previewContainer = document.getElementById('screenshot-preview-container');
        const previewImg = document.getElementById('screenshot-preview-img');
        const dropzonePlaceholder = document.getElementById('dropzone-placeholder');

        if (previewImg && previewContainer && dropzonePlaceholder) {
          previewImg.src = this.uploadedScreenshotBase64;
          previewContainer.classList.remove('hidden');
          dropzonePlaceholder.classList.add('hidden');
        }
        this.showToast('Payment screenshot attached successfully!', 'success');
      };

      img.onerror = () => {
        // Fallback to raw data url if canvas decode fails
        this.uploadedScreenshotBase64 = event.target.result;
        const previewContainer = document.getElementById('screenshot-preview-container');
        const previewImg = document.getElementById('screenshot-preview-img');
        const dropzonePlaceholder = document.getElementById('dropzone-placeholder');
        if (previewImg && previewContainer && dropzonePlaceholder) {
          previewImg.src = this.uploadedScreenshotBase64;
          previewContainer.classList.remove('hidden');
          dropzonePlaceholder.classList.add('hidden');
        }
        this.showToast('Payment screenshot attached!', 'success');
      };

      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }

  removeScreenshot() {
    this.uploadedScreenshotBase64 = '';
    const fileInput = document.getElementById('reg-screenshot');
    if (fileInput) fileInput.value = '';
    const previewContainer = document.getElementById('screenshot-preview-container');
    const previewImg = document.getElementById('screenshot-preview-img');
    const dropzonePlaceholder = document.getElementById('dropzone-placeholder');

    if (previewImg && previewContainer && dropzonePlaceholder) {
      previewImg.src = '';
      previewContainer.classList.add('hidden');
      dropzonePlaceholder.classList.remove('hidden');
    }
  }

  updateFeeCalculation() {
    const fee = 250;
    this.currentTotal = fee;

    const feeDisplay = document.getElementById('calculated-fee-amount');
    const feeBreakdown = document.getElementById('fee-breakdown-text');

    if (feeDisplay) feeDisplay.textContent = `₹${fee}`;
    if (feeBreakdown) {
      if (this.selectedEvents.size === 0) feeBreakdown.textContent = 'Please select 2 events (1 technical + 1 non-technical)';
      else feeBreakdown.textContent = 'Symposium Registration Fee (1 Technical + 1 Non-Technical)';
    }

    this.generateUpiQR(fee);
  }

  generateUpiQR(amount) {
    const qrContainer = document.getElementById('dynamic-upi-qrcode');
    if (!qrContainer) return;

    const upiUrl = `upi://pay?pa=harshinibala30@oksbi&pn=Nexorithm%202026%20IJCE&am=${amount}&cu=INR&tn=Nexorithm%20Reg%20Fee`;

    // Clear previous QR
    qrContainer.innerHTML = '';

    // Generate QR using QRCode library or SVG fallback
    if (window.QRCode) {
      new QRCode(qrContainer, {
        text: upiUrl,
        width: 170,
        height: 170,
        colorDark: '#060a12',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.M
      });
    } else {
      // Direct high-res SVG QR Generator via standard encoded API
      const qrImg = document.createElement('img');
      qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiUrl)}&bgcolor=ffffff&color=0b0f19&margin=1`;
      qrImg.alt = 'Nexorithm UPI QR Code';
      qrImg.className = 'rounded-xl shadow-lg';
      qrContainer.appendChild(qrImg);
    }
  }

  async handleFormSubmit(e) {
    e.preventDefault();

    // 1. Validation
    const fullName = document.getElementById('reg-name')?.value.trim();
    const college = document.getElementById('reg-college')?.value.trim();
    const dept = document.getElementById('reg-dept')?.value.trim();
    const year = document.getElementById('reg-year')?.value;
    const email = document.getElementById('reg-email')?.value.trim();
    const phone = document.getElementById('reg-phone')?.value.trim();
    const transactionId = document.getElementById('reg-transaction-id')?.value.trim();
    const foodPreference = document.querySelector('input[name="reg-food"]:checked')?.value || '';

    if (!fullName || !college || !dept || !year || !email || !phone) {
      this.showToast('Please fill in all mandatory delegate details', 'error');
      return;
    }

    if (!foodPreference) {
      this.showToast('Please select your food preference (Veg / Non-Veg)', 'error');
      return;
    }

    if (this.selectedEvents.size !== 2) {
      this.showToast('Please select exactly 2 events: one technical and one non-technical.', 'error');
      return;
    }

    const selectedEventList = Array.from(this.selectedEvents);
    const hasTechnical = selectedEventList.some((evId) => {
      const event = EVENTS_DATA.find((e) => e.id === evId);
      return event && event.category === 'technical';
    });
    const hasNonTechnical = selectedEventList.some((evId) => {
      const event = EVENTS_DATA.find((e) => e.id === evId);
      return event && event.category === 'non-technical';
    });

    if (!hasTechnical || !hasNonTechnical) {
      this.showToast('Each participant must choose one technical and one non-technical event.', 'error');
      return;
    }

    if (!transactionId) {
      this.showToast('Please enter your UPI / GPay Transaction Reference ID (UTR)', 'error');
      return;
    }

    const regId = 'NX-' + Math.floor(1000 + Math.random() * 9000);

    const registrationRecord = {
      id: regId,
      fullName,
      college,
      dept,
      year,
      email,
      phone,
      events: Array.from(this.selectedEvents),
      teamSize: 1,
      teamMembers: [fullName],
      amount: this.currentTotal,
      foodPreference,
      paymentMethod: 'UPI / GPay',
      transactionId,
      screenshot: this.uploadedScreenshotBase64,
      paymentVerified: true,
      timestamp: new Date().toISOString()
    };

    // 2. Save into persistent storage
    const submitBtn = document.getElementById('btn-submit-reg');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm mr-2"></span> Generating Delegate Pass...';
    }

    try {
      await window.nexStorage.saveRegistration(registrationRecord);

      // Trigger Confetti!
      if (window.confetti) {
        window.confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      }

      // Show Pass Modal
      this.displayDelegatePass(registrationRecord);

      // Reset form
      e.target.reset();
      this.removeScreenshot();
      this.selectedEvents.clear();
      this.updateFeeCalculation();

      this.showToast('Registration Confirmed! Your official pass is ready.', 'success');
    } catch (err) {
      console.error(err);
      this.showToast(err && err.message ? err.message : 'Error saving registration. Please try again.', 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Confirm & Generate Delegate Pass</span> <i data-lucide="arrow-right"></i>';
        if (window.lucide) lucide.createIcons();
      }
    }
  }

  displayDelegatePass(record) {
    const modal = document.getElementById('pass-modal');
    if (!modal) return;

    const eventNames = record.events.map((evId) => {
      const ev = EVENTS_DATA.find((e) => e.id === evId);
      return ev ? ev.title : evId;
    }).join(', ');

    document.getElementById('pass-id-display').textContent = record.id;
    document.getElementById('pass-name-display').textContent = record.fullName;
    document.getElementById('pass-college-display').textContent = record.college;
    document.getElementById('pass-dept-display').textContent = `${record.dept} (${record.year})`;
    document.getElementById('pass-events-display').textContent = eventNames;
    document.getElementById('pass-amount-display').textContent = `₹${record.amount} (Paid & Verified)`;
    const foodEl = document.getElementById('pass-food-display');
    if (foodEl) foodEl.textContent = record.foodPreference === 'Non-Vegetarian' ? '🍗 Non-Vegetarian' : '🥦 Vegetarian';
    document.getElementById('pass-date-display').textContent = new Date(record.timestamp).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    // Pass Verification QR
    const passQrEl = document.getElementById('pass-verification-qr');
    if (passQrEl) {
      passQrEl.innerHTML = '';
      const passVerifyText = `NEXORITHM-2026-PASS|${record.id}|${record.fullName}|${record.college}|${record.events.join(',')}`;
      if (window.QRCode) {
        new QRCode(passQrEl, {
          text: passVerifyText,
          width: 110,
          height: 110,
          colorDark: '#050a12',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.L
        });
      } else {
        const qrImg = document.createElement('img');
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${encodeURIComponent(passVerifyText)}&bgcolor=ffffff&color=050a12`;
        qrImg.alt = 'Pass QR';
        passQrEl.appendChild(qrImg);
      }
    }

    modal.classList.add('is-open');
    if (window.lucide) lucide.createIcons();
  }

  updateEventCheckboxesState() {
    const isMaxReached = this.selectedEvents.size >= 2;
    document.querySelectorAll('.event-check-card').forEach((card) => {
      const chk = card.querySelector('.event-checkbox');
      if (chk) {
        if (this.selectedEvents.has(chk.value)) {
          card.classList.add('is-selected');
          card.classList.remove('is-disabled');
          chk.disabled = false;
        } else {
          card.classList.remove('is-selected');
          if (isMaxReached) {
            card.classList.add('is-disabled');
            chk.disabled = true;
          } else {
            card.classList.remove('is-disabled');
            chk.disabled = false;
          }
        }
      }
    });
  }

  showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `custom-toast toast-${type}`;

    let iconName = 'info';
    if (type === 'success') iconName = 'check-circle';
    if (type === 'error') iconName = 'alert-triangle';

    toast.innerHTML = `
      <i data-lucide="${iconName}" class="toast-icon"></i>
      <span class="toast-msg">${message}</span>
    `;

    toastContainer.appendChild(toast);
    if (window.lucide) lucide.createIcons();

    setTimeout(() => {
      toast.classList.add('toast-show');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('toast-show');
      setTimeout(() => toast.remove(), 400);
    }, 4500);
  }
}

window.setupRegistrationView = function (preselectedEventId) {
  if (!window.nexRegistration) {
    window.nexRegistration = new NexRegistration();
  }

  if (preselectedEventId) {
    // If preselected and at capacity, clear prior selection
    if (window.nexRegistration.selectedEvents.size >= 2) {
      window.nexRegistration.selectedEvents.clear();
    }
    window.nexRegistration.selectedEvents.add(preselectedEventId);
  }

  // Populate events checkbox grid in the registration form
  const eventGrid = document.getElementById('reg-events-grid');
  if (eventGrid) {
    let html = '';
    EVENTS_DATA.forEach((ev) => {
      const isPreselected = window.nexRegistration.selectedEvents.has(ev.id);
      html += `
        <label class="event-check-card ${isPreselected ? 'is-selected' : ''}" for="chk-${ev.id}">
          <input type="checkbox" id="chk-${ev.id}" class="event-checkbox" value="${ev.id}" ${isPreselected ? 'checked' : ''} />
          <div class="event-check-content">
            <div class="flex items-center justify-between mb-1">
              <span class="badge ${ev.category === 'technical' ? 'badge-cyan' : 'badge-purple'}">${ev.category}</span>
            </div>
            <h4 class="font-bold text-white text-sm mb-1">${ev.title}</h4>
            <p class="text-xs text-slate-400 leading-tight mb-2 line-clamp-2">${ev.tagline}</p>
          </div>
        </label>
      `;
    });
    eventGrid.innerHTML = html;
  }

  window.nexRegistration.updateEventCheckboxesState();
  window.nexRegistration.updateFeeCalculation();
  if (window.lucide) lucide.createIcons();
};

window.removeAttachedScreenshot = function () {
  if (window.nexRegistration) {
    window.nexRegistration.removeScreenshot();
  }
};

window.closePassModal = function () {
  const modal = document.getElementById('pass-modal');
  if (modal) modal.classList.remove('is-open');
};

window.printPass = function () {
  window.print();
};

// =========================================================================
// OPTIONAL FRIENDS / GROUP REGISTRATION
// =========================================================================

let friendCount = 0;

window.addFriendEntry = function () {
  friendCount++;
  const container = document.getElementById('friends-list-container');
  const hint = document.getElementById('friends-empty-hint');
  if (hint) hint.style.display = 'none';

  const card = document.createElement('div');
  card.id = `friend-card-${friendCount}`;
  card.style.cssText = `
    background: rgba(8,12,22,0.7);
    border: 1px solid rgba(0,240,255,0.2);
    border-radius: 14px;
    padding: 14px 16px;
    position: relative;
    animation: fadeInUp 0.25s ease;
  `;

  card.innerHTML = `
    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;">
      <span style="font-size:11px; font-family:var(--font-mono); color:var(--brand-cyan); letter-spacing:0.05em;">
        PERSON ${friendCount}
      </span>
      <button type="button"
        onclick="window.removeFriendEntry(${friendCount})"
        title="Remove"
        style="background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); border-radius:8px;
               color:#f87171; padding:3px 8px; font-size:11px; cursor:pointer; display:flex; align-items:center; gap:4px;">
        ✕ Remove
      </button>
    </div>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
      <div>
        <label style="display:block; font-size:11px; font-family:var(--font-mono); color:var(--text-muted); margin-bottom:5px;">
          PHONE NUMBER
        </label>
        <input
          type="tel"
          name="friend_phone_${friendCount}"
          placeholder="10-digit mobile number"
          maxlength="10"
          class="form-control"
          style="font-size:13px; padding:9px 12px;"
        />
      </div>
      <div>
        <label style="display:block; font-size:11px; font-family:var(--font-mono); color:var(--text-muted); margin-bottom:5px;">
          COLLEGE NAME
        </label>
        <input
          type="text"
          name="friend_college_${friendCount}"
          placeholder="Their college name"
          class="form-control"
          style="font-size:13px; padding:9px 12px;"
        />
      </div>
    </div>
  `;

  container.appendChild(card);

  // Re-init lucide icons if any
  if (window.lucide) lucide.createIcons();
};

window.removeFriendEntry = function (id) {
  const card = document.getElementById(`friend-card-${id}`);
  if (card) card.remove();

  const container = document.getElementById('friends-list-container');
  const hint = document.getElementById('friends-empty-hint');
  if (hint && container && container.children.length === 0) {
    hint.style.display = '';
  }
};

// Payment Screenshot Zoom Lightbox
window.zoomScreenshotPreview = function () {
  const previewImg = document.getElementById('screenshot-preview-img');
  const zoomModal = document.getElementById('screenshot-zoom-modal');
  const zoomImg = document.getElementById('screenshot-zoom-img');

  if (!previewImg || !zoomModal || !zoomImg || !previewImg.src) return;

  zoomImg.src = previewImg.src;
  zoomModal.classList.add('is-open');
};

window.closeScreenshotZoom = function () {
  const zoomModal = document.getElementById('screenshot-zoom-modal');
  const zoomImg = document.getElementById('screenshot-zoom-img');
  if (zoomModal) zoomModal.classList.remove('is-open');
  if (zoomImg) zoomImg.src = '';
};
