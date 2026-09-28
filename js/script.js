/**
 * BREW & BEAN - Premium Café Static Website
 * Academic BCA Project - Front-End Interactions
 * Pure Vanilla JavaScript (No external libraries required)
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initOrderSystem();
  initMenuFiltering();
  initGalleryLightbox();
  initReservationForm();
  initContactForm();
  initReviewForm();
  initOffersCopy();
  initNewsletterForm();
  initScrollTop();
  initBrewCustomizer();
});

/* ==========================================================================
   1. NAVIGATION & MOBILE MENU
   ========================================================================== */
function initNavigation() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-item a, .mobile-nav-links a');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Mobile Hamburger Toggle
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileNav = document.getElementById('mobileNav');

  if (hamburgerBtn && mobileNav) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = hamburgerBtn.classList.toggle('open');
      mobileNav.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on clicking any link in mobile nav
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Header background on scroll
  const siteHeader = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      siteHeader?.classList.add('scrolled');
    } else {
      siteHeader?.classList.remove('scrolled');
    }
  });
}

/* ==========================================================================
   2. STATIC ORDER & CART SYSTEM (Front-End Demonstration)
   ========================================================================== */
let cartItems = [];

function initOrderSystem() {
  // Add to order buttons
  document.querySelectorAll('.btn-add-order').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.product-card') || btn.closest('.menu-item-row');
      const name = btn.dataset.name || card?.querySelector('.product-title')?.textContent?.trim() || 'Café Item';
      const price = parseInt(btn.dataset.price || card?.dataset.price || '150', 10);
      const image = btn.dataset.image || card?.querySelector('img')?.getAttribute('src') || '';

      addToCart(name, price, image);
    });
  });

  // Cart Open Buttons
  document.querySelectorAll('.cart-open-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openCartDrawer();
    });
  });

  // Cart Close Buttons
  document.getElementById('cartCloseBtn')?.addEventListener('click', closeCartDrawer);
  document.getElementById('cartModalOverlay')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeCartDrawer();
  });

  // Checkout Demonstration button
  document.getElementById('cartCheckoutBtn')?.addEventListener('click', () => {
    if (cartItems.length === 0) {
      showToast('Your order tray is empty!');
      return;
    }
    closeCartDrawer();
    openConfirmationModal(
      'Order Summary (Demonstration)',
      'Thank you for testing the static order flow! In this BCA academic project, orders are simulated client-side without payment gateways.',
      'Order Reference: #BB-DEMO-' + Math.floor(1000 + Math.random() * 9000)
    );
    cartItems = [];
    updateCartUI();
  });
}

function addToCart(name, price, image) {
  const existing = cartItems.find(item => item.name === name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cartItems.push({ name, price, image, quantity: 1 });
  }
  updateCartUI();
  showToast(`Added "${name}" to your order tray!`);
}

function updateCartUI() {
  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Update badges
  document.querySelectorAll('.cart-badge-count').forEach(el => {
    el.textContent = totalCount.toString();
  });

  // Update floating bar
  const floatingBar = document.getElementById('floatingOrderBar');
  if (floatingBar) {
    if (totalCount > 0) {
      floatingBar.classList.add('show');
      const floatingText = floatingBar.querySelector('.floating-order-text');
      if (floatingText) {
        floatingText.textContent = `${totalCount} item${totalCount > 1 ? 's' : ''} (₹${totalPrice})`;
      }
    } else {
      floatingBar.classList.remove('show');
    }
  }

  // Update Cart Drawer List
  const cartList = document.getElementById('cartItemsList');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const cartTax = document.getElementById('cartTax');
  const cartTotal = document.getElementById('cartTotal');

  if (cartList) {
    if (cartItems.length === 0) {
      cartList.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem; color: var(--color-text-muted);">
          <div style="font-size: 2.5rem; margin-bottom: 0.8rem;">☕</div>
          <p style="font-weight: 500;">Your order tray is empty.</p>
          <small>Explore our coffee, food & desserts to add items.</small>
        </div>
      `;
    } else {
      cartList.innerHTML = cartItems.map((item, index) => `
        <div class="cart-item-row">
          <div>
            <h4 style="font-size: 0.95rem; margin-bottom: 0.2rem; color: var(--color-espresso-900);">${item.name}</h4>
            <div style="font-size: 0.82rem; color: var(--color-caramel-500); font-weight: 600;">₹${item.price} each</div>
          </div>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <button onclick="changeItemQty(${index}, -1)" style="width: 26px; height: 26px; border-radius: 4px; background: var(--color-cream-200); border: 1px solid var(--color-border); font-weight: bold;">-</button>
            <span style="font-size: 0.9rem; font-weight: 600; min-width: 18px; text-align: center;">${item.quantity}</span>
            <button onclick="changeItemQty(${index}, 1)" style="width: 26px; height: 26px; border-radius: 4px; background: var(--color-cream-200); border: 1px solid var(--color-border); font-weight: bold;">+</button>
            <button onclick="removeItem(${index})" style="color: #c92a2a; margin-left: 0.4rem; font-size: 1.1rem; padding: 2px 6px;">&times;</button>
          </div>
        </div>
      `).join('');
    }
  }

  const tax = Math.round(totalPrice * 0.05); // 5% GST representation
  const finalTotal = totalPrice + tax;

  if (cartSubtotal) cartSubtotal.textContent = `₹${totalPrice}`;
  if (cartTax) cartTax.textContent = `₹${tax}`;
  if (cartTotal) cartTotal.textContent = `₹${finalTotal}`;
}

window.changeItemQty = function(index, delta) {
  if (!cartItems[index]) return;
  cartItems[index].quantity += delta;
  if (cartItems[index].quantity <= 0) {
    cartItems.splice(index, 1);
  }
  updateCartUI();
};

window.removeItem = function(index) {
  if (!cartItems[index]) return;
  cartItems.splice(index, 1);
  updateCartUI();
};

function openCartDrawer() {
  const modal = document.getElementById('cartModalOverlay');
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeCartDrawer() {
  const modal = document.getElementById('cartModalOverlay');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

/* ==========================================================================
   3. MENU CATEGORY FILTERING & LIVE SEARCH
   ========================================================================== */
function initMenuFiltering() {
  const filterBtns = document.querySelectorAll('.menu-filter-btn');
  const menuCards = document.querySelectorAll('.menu-filterable-item');
  const searchInput = document.getElementById('menuSearchInput');
  const emptyState = document.getElementById('menuEmptyState');

  if (!filterBtns.length && !searchInput) return;

  let activeCategory = 'all';
  let searchTerm = '';

  function applyFilters() {
    let matchCount = 0;

    menuCards.forEach(card => {
      const category = card.dataset.category || '';
      const title = card.querySelector('.product-title')?.textContent?.toLowerCase() || '';
      const desc = card.querySelector('.product-description')?.textContent?.toLowerCase() || '';

      const matchesCat = activeCategory === 'all' || category.toLowerCase() === activeCategory.toLowerCase();
      const matchesSearch = !searchTerm || title.includes(searchTerm) || desc.includes(searchTerm);

      if (matchesCat && matchesSearch) {
        card.style.display = '';
        matchCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (emptyState) {
      emptyState.style.display = matchCount === 0 ? 'block' : 'none';
    }
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.filter || 'all';
      applyFilters();
    });
  });

  searchInput?.addEventListener('input', (e) => {
    searchTerm = e.target.value.toLowerCase().trim();
    applyFilters();
  });
}

/* ==========================================================================
   4. GALLERY FILTERING & LIGHTBOX MODAL
   ========================================================================== */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const galleryFilterBtns = document.querySelectorAll('.gallery-filter-btn');
  const lightbox = document.getElementById('galleryLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxCloseBtn');
  const prevBtn = document.getElementById('lightboxPrevBtn');
  const nextBtn = document.getElementById('lightboxNextBtn');

  if (!galleryItems.length) return;

  let currentIndex = 0;
  let visibleItems = Array.from(galleryItems);

  // Category filtering
  galleryFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      galleryFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter || 'all';

      galleryItems.forEach(item => {
        const cat = item.dataset.category || '';
        if (filter === 'all' || cat === filter) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });

      visibleItems = Array.from(galleryItems).filter(item => item.style.display !== 'none');
    });
  });

  // Open Lightbox
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      visibleItems = Array.from(galleryItems).filter(i => i.style.display !== 'none');
      currentIndex = visibleItems.indexOf(item);
      if (currentIndex === -1) currentIndex = 0;
      updateLightbox();
      if (lightbox) {
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function updateLightbox() {
    const item = visibleItems[currentIndex];
    if (!item || !lightboxImg) return;
    const img = item.querySelector('img');
    const title = item.querySelector('h4')?.textContent || 'Brew & Bean Gallery';
    const tag = item.querySelector('span')?.textContent || '';
    lightboxImg.src = img ? img.src : '';
    if (lightboxCaption) {
      lightboxCaption.innerHTML = `${title} <br><small style="color: var(--color-caramel-300); font-size: 0.85rem; font-family: var(--font-sans);">${tag}</small>`;
    }
  }

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  closeBtn?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  prevBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (visibleItems.length === 0) return;
    currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    updateLightbox();
  });

  nextBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (visibleItems.length === 0) return;
    currentIndex = (currentIndex + 1) % visibleItems.length;
    updateLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevBtn?.click();
    if (e.key === 'ArrowRight') nextBtn?.click();
  });
}

/* ==========================================================================
   5. RESERVATION FORM VALIDATION & CONFIRMATION MODAL
   ========================================================================== */
function initReservationForm() {
  const form = document.getElementById('reservationForm');
  if (!form) return;

  // Set min date to today
  const dateInput = document.getElementById('resDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Validate fields
    const name = form.elements['fullName'];
    const email = form.elements['email'];
    const phone = form.elements['phone'];
    const date = form.elements['resDate'];
    const time = form.elements['resTime'];
    const guests = form.elements['guests'];
    const seating = form.elements['seating']?.value || 'Standard';

    // Clear previous errors
    form.querySelectorAll('.form-control').forEach(ctrl => ctrl.classList.remove('error'));

    if (!name.value.trim() || name.value.trim().length < 3) {
      name.classList.add('error');
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
      email.classList.add('error');
      isValid = false;
    }

    const phoneRegex = /^[0-9+ -]{10,15}$/;
    if (!phone.value.trim() || !phoneRegex.test(phone.value.trim())) {
      phone.classList.add('error');
      isValid = false;
    }

    if (!date.value) {
      date.classList.add('error');
      isValid = false;
    }

    if (!time.value) {
      time.classList.add('error');
      isValid = false;
    }

    if (!guests.value || parseInt(guests.value, 10) < 1) {
      guests.classList.add('error');
      isValid = false;
    }

    if (!isValid) {
      showToast('Please correct the highlighted fields in the form.');
      return;
    }

    // Generate Booking Reference
    const refCode = '#BB-' + Math.floor(1000 + Math.random() * 9000);
    const summaryMsg = `
      <strong>Reservation Confirmed!</strong><br>
      Name: ${name.value.trim()}<br>
      Party of ${guests.value} guests · ${seating} area<br>
      Date: ${date.value} at ${time.value}<br>
      <br>
      <span style="font-size: 0.85rem; color: var(--color-caramel-500);">Booking Reference: ${refCode}</span>
    `;

    openConfirmationModal(
      'Table Reservation Received!',
      'Thank you! Your table reservation request has been received. Our team has reserved your spot for an exceptional café experience.',
      summaryMsg
    );

    form.reset();
  });
}

/* ==========================================================================
   6. CONTACT FORM VALIDATION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    const name = form.elements['contactName'];
    const email = form.elements['contactEmail'];
    const subject = form.elements['contactSubject'];
    const message = form.elements['contactMessage'];

    form.querySelectorAll('.form-control').forEach(ctrl => ctrl.classList.remove('error'));

    if (!name.value.trim()) {
      name.classList.add('error');
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
      email.classList.add('error');
      isValid = false;
    }

    if (!subject.value.trim()) {
      subject.classList.add('error');
      isValid = false;
    }

    if (!message.value.trim() || message.value.trim().length < 10) {
      message.classList.add('error');
      isValid = false;
    }

    if (!isValid) {
      showToast('Please fill out all required fields correctly.');
      return;
    }

    openConfirmationModal(
      'Message Received!',
      'Thank you for reaching out to Brew & Bean Café. We have received your inquiry and our team will get back to you shortly.',
      'Ref: Inquiry #' + Math.floor(1000 + Math.random() * 9000)
    );

    form.reset();
  });
}

/* ==========================================================================
   7. REVIEWS: STAR SELECTION & SUBMISSION
   ========================================================================== */
function initReviewForm() {
  const starContainer = document.getElementById('starRatingSelector');
  const reviewForm = document.getElementById('reviewForm');
  const reviewsGrid = document.getElementById('reviewsGrid');
  let selectedRating = 5;

  if (starContainer) {
    const stars = starContainer.querySelectorAll('.star');

    function highlightStars(count) {
      stars.forEach((star, idx) => {
        if (idx < count) {
          star.classList.add('selected');
        } else {
          star.classList.remove('selected');
        }
      });
    }

    highlightStars(selectedRating);

    stars.forEach((star, index) => {
      star.addEventListener('mouseenter', () => {
        stars.forEach((s, idx) => {
          s.classList.toggle('hovered', idx <= index);
        });
      });

      star.addEventListener('mouseleave', () => {
        stars.forEach(s => s.classList.remove('hovered'));
      });

      star.addEventListener('click', () => {
        selectedRating = index + 1;
        highlightStars(selectedRating);
      });
    });
  }

  if (reviewForm && reviewsGrid) {
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = reviewForm.elements['reviewerName']?.value.trim();
      const coffee = reviewForm.elements['orderedItem']?.value.trim() || 'Signature Coffee';
      const comment = reviewForm.elements['reviewComment']?.value.trim();

      if (!name || !comment) {
        showToast('Please provide your name and your experience review.');
        return;
      }

      const starsHtml = '★'.repeat(selectedRating) + '☆'.repeat(5 - selectedRating);

      const newCard = document.createElement('div');
      newCard.className = 'review-card';
      newCard.style.animation = 'slideUp 0.4s ease';
      newCard.innerHTML = `
        <div class="review-header">
          <div class="review-avatar" style="display:flex;align-items:center;justify-content:center;background:var(--color-espresso-900);color:#fff;font-weight:700;font-size:1.1rem;">
            ${name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div class="review-name">${name} <span style="font-size:0.75rem; background:rgba(45,106,79,0.15); color:var(--color-success); padding:2px 6px; border-radius:4px; margin-left:4px;">Verified Visit</span></div>
            <div class="review-stars">${starsHtml}</div>
          </div>
        </div>
        <p class="review-quote">"${comment}"</p>
        <div style="margin-top: 1rem; font-size: 0.8rem; color: var(--color-caramel-500); font-weight: 600;">
          Enjoyed: ${coffee} · Today
        </div>
      `;

      reviewsGrid.insertBefore(newCard, reviewsGrid.firstChild);
      showToast('Thank you! Your review has been published.');
      reviewForm.reset();
      if (starContainer) {
        selectedRating = 5;
        starContainer.querySelectorAll('.star').forEach(s => s.classList.add('selected'));
      }
    });
  }
}

/* ==========================================================================
   8. SPECIAL OFFERS CODE COPY
   ========================================================================== */
function initOffersCopy() {
  document.querySelectorAll('.copy-code-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.dataset.code || 'BREW2026';
      navigator.clipboard.writeText(code).then(() => {
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.style.backgroundColor = 'var(--color-caramel-500)';
        btn.style.color = '#ffffff';
        showToast(`Promo code "${code}" copied to clipboard!`);
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.backgroundColor = '';
          btn.style.color = '';
        }, 2500);
      }).catch(() => {
        showToast(`Promo Code: ${code}`);
      });
    });
  });
}

/* ==========================================================================
   9. NEWSLETTER FORM
   ========================================================================== */
function initNewsletterForm() {
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input && input.value.includes('@')) {
        showToast('Thank you for subscribing to Brew & Bean updates!');
        input.value = '';
      } else {
        showToast('Please enter a valid email address.');
      }
    });
  });
}

/* ==========================================================================
   10. SCROLL TO TOP
   ========================================================================== */
function initScrollTop() {
  const scrollBtn = document.getElementById('scrollTopBtn');
  if (!scrollBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
  });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   11. COFFEE CHOOSER & INTERACTIVE MATRIX
   ========================================================================== */
function initBrewCustomizer() {
  const brewOptions = document.querySelectorAll('.brew-mood-card');
  const resultBox = document.getElementById('brewRecommendationResult');

  if (brewOptions.length && resultBox) {
    brewOptions.forEach(opt => {
      opt.addEventListener('click', () => {
        brewOptions.forEach(b => b.classList.remove('active'));
        opt.classList.add('active');

        const recName = opt.dataset.recName || 'Caramel Macchiato';
        const recDesc = opt.dataset.recDesc || 'Rich espresso with creamy steamed milk and artisan caramel drizzle.';
        const recPrice = opt.dataset.recPrice || '160';

        resultBox.innerHTML = `
          <div style="background:#ffffff; border-radius:14px; padding:1.75rem; border:1px solid var(--color-border); box-shadow:var(--shadow-sm); animation:fadeIn 0.3s ease;">
            <div style="text-transform:uppercase; font-size:0.75rem; letter-spacing:1.5px; color:var(--color-caramel-500); font-weight:700;">Our Barista Recommendation for You</div>
            <h3 style="font-size:1.5rem; margin:0.4rem 0; color:var(--color-espresso-900);">${recName}</h3>
            <p style="color:var(--color-text-muted); font-size:0.95rem; margin-bottom:1.25rem;">${recDesc}</p>
            <div style="display:flex; align-items:center; justify-content:space-between; border-top:1px solid var(--color-cream-200); padding-top:1rem;">
              <span style="font-family:var(--font-serif); font-size:1.35rem; font-weight:700; color:var(--color-espresso-900);">₹${recPrice}</span>
              <button class="btn btn-primary btn-sm btn-add-order" data-name="${recName}" data-price="${recPrice}">Add to Order Tray</button>
            </div>
          </div>
        `;

        // Re-attach add order listener
        resultBox.querySelector('.btn-add-order')?.addEventListener('click', (e) => {
          e.preventDefault();
          addToCart(recName, parseInt(recPrice, 10), '');
        });
      });
    });
  }
}

/* ==========================================================================
   GLOBAL UTILITIES: TOAST & MODAL
   ========================================================================== */
function showToast(message) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>☕</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

function openConfirmationModal(title, message, subDetail = '') {
  let modal = document.getElementById('globalConfirmationModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'globalConfirmationModal';
    modal.className = 'confirmation-modal';
    modal.innerHTML = `
      <div class="modal-card">
        <div class="modal-icon-badge">☕</div>
        <h3 id="modalConfirmTitle" style="font-size:1.5rem; margin-bottom:0.75rem; color:var(--color-espresso-900);"></h3>
        <p id="modalConfirmMessage" style="color:var(--color-text-muted); font-size:0.95rem; line-height:1.6; margin-bottom:1.25rem;"></p>
        <div id="modalConfirmSub" style="background:var(--color-cream-100); border:1px solid var(--color-border); border-radius:8px; padding:1rem; margin-bottom:1.75rem; font-size:0.9rem; text-align:left;"></div>
        <button id="modalConfirmCloseBtn" class="btn btn-primary" style="width:100%;">Wonderful, Got It</button>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('#modalConfirmCloseBtn').addEventListener('click', () => {
      modal.classList.remove('show');
      document.body.style.overflow = '';
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
      }
    });
  }

  modal.querySelector('#modalConfirmTitle').textContent = title;
  modal.querySelector('#modalConfirmMessage').textContent = message;
  modal.querySelector('#modalConfirmSub').innerHTML = subDetail;
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}
