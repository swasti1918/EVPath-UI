/**
 * EVPath Main Application Script
 * - Dark theme with smooth animations
 * - Mobile-responsive navigation
 * - Interactive charts and forms
 * - Scroll-triggered animations
 */

document.addEventListener('DOMContentLoaded', () => {
  // ====================== DOM Elements ======================
  const elements = {
    navbar: document.querySelector('.navbar'),
    hamburger: document.querySelector('.hamburger'),
    navLinks: document.querySelector('.nav-links'),
    featureCards: document.querySelectorAll('.feature-card'),
    statNumbers: document.querySelectorAll('[data-count]'),
    faqItems: document.querySelectorAll('.faq-item'),
    btnPrimary: document.querySelectorAll('.btn-primary'),
    scrollLinks: document.querySelectorAll('a[href^="#"]'),
    themeBtn: document.getElementById('theme-btn')
  };

  // ====================== Mobile Navigation ======================
  const toggleMobileMenu = () => {
    elements.hamburger.classList.toggle('active');
    elements.navLinks.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  };

  if (elements.hamburger) {
    elements.hamburger.addEventListener('click', toggleMobileMenu);
    
    // Close menu when clicking nav links
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        if (elements.navLinks.classList.contains('active')) {
          toggleMobileMenu();
        }
      });
    });
  }

  // ====================== Navbar Scroll Effect ======================
  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
      elements.navbar.classList.add('scrolled');
      elements.navbar.classList.toggle('hidden', scrollTop > 120 && scrollTop > lastScrollTop);
    } else {
      elements.navbar.classList.remove('scrolled', 'hidden');
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  };

  let lastScrollTop = 0;
  window.addEventListener('scroll', handleScroll);

  // ====================== Animate Features on Scroll ======================
  const animateFeatures = () => {
    elements.featureCards.forEach((card, index) => {
      const cardPosition = card.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.3;

      if (cardPosition < screenPosition) {
        setTimeout(() => {
          card.classList.add('show');
        }, index * 150);
      }
    });
  };

  // ====================== Animate Stats Counting ======================
  const animateStats = () => {
    elements.statNumbers.forEach(stat => {
      const target = +stat.getAttribute('data-count');
      const count = +stat.textContent.replace(/\D/g, '');
      const increment = target / 50;

      if (count < target) {
        stat.textContent = Math.ceil(count + increment).toLocaleString();
        setTimeout(animateStats, 20);
      } else {
        stat.textContent = target.toLocaleString();
      }
    });
  };

  // ====================== FAQ Accordion ======================
  const setupFAQAccordion = () => {
    elements.faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      const icon = question?.querySelector('i');

      question?.addEventListener('click', () => {
        const isOpen = item.classList.toggle('active');
        
        if (answer) {
          answer.style.maxHeight = isOpen ? `${answer.scrollHeight}px` : '0';
        }
        
        if (icon) {
          icon.classList.toggle('fa-chevron-up', isOpen);
          icon.classList.toggle('fa-chevron-down', !isOpen);
        }

        // Close other items
        elements.faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
            const otherAnswer = otherItem.querySelector('.faq-answer');
            const otherIcon = otherItem.querySelector('i');
            if (otherAnswer) otherAnswer.style.maxHeight = '0';
            if (otherIcon) {
              otherIcon.classList.remove('fa-chevron-up');
              otherIcon.classList.add('fa-chevron-down');
            }
          }
        });
      });
    });
  };

  // ====================== Button Effects ======================
  const addButtonEffects = () => {
    elements.btnPrimary.forEach(btn => {
      btn.addEventListener('click', function() {
        this.classList.add('pulse');
        setTimeout(() => this.classList.remove('pulse'), 500);
      });
    });
  };

  // ====================== Smooth Scrolling ======================
  const setupSmoothScrolling = () => {
    elements.scrollLinks.forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      });
    });
  };

  // ====================== Theme Toggle ======================
  const setupThemeToggle = () => {
    if (!elements.themeBtn) return;

    elements.themeBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      const icon = elements.themeBtn.querySelector('i');
      
      if (document.body.classList.contains('light-theme')) {
        icon?.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('theme', 'light');
      } else {
        icon?.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('theme', 'dark');
      }
    });

    // Initialize theme from localStorage
    if (localStorage.getItem('theme') === 'light') {
      document.body.classList.add('light-theme');
      const icon = elements.themeBtn.querySelector('i');
      if (icon) icon.classList.replace('fa-moon', 'fa-sun');
    }
  };

  // ====================== Initialize EV Trend Chart ======================
  const initChart = () => {
    const canvas = document.getElementById('evTrendChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Gradient for chart line
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(0, 230, 118, 0.8)');
    gradient.addColorStop(1, 'rgba(0, 176, 255, 0.6)');

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['2020', '2021', '2022', '2023', '2024', '2025'],
        datasets: [{
          label: 'EV Adoption (millions)',
          data: [1.2, 2.8, 5.0, 8.7, 13.4, 20.0],
          backgroundColor: 'rgba(0, 230, 118, 0.1)',
          borderColor: gradient,
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#00e676',
          pointRadius: 5,
          pointHoverRadius: 7
        }]
      },
      options: getChartOptions()
    });
  };

  const getChartOptions = () => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: 'easeOutQuart'
    },
    plugins: {
      legend: {
        labels: {
          color: getComputedStyle(document.body).getPropertyValue('--text-light'),
          font: {
            size: 14,
            family: 'Inter'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(30, 41, 59, 0.9)',
        titleColor: '#00e676',
        bodyColor: '#f8fafc',
        borderColor: 'rgba(0, 230, 118, 0.3)',
        borderWidth: 1,
        padding: 12,
        displayColors: false
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(148, 163, 184, 0.1)'
        },
        ticks: {
          color: getComputedStyle(document.body).getPropertyValue('--text-muted')
        }
      },
      y: {
        grid: {
          color: 'rgba(148, 163, 184, 0.1)'
        },
        ticks: {
          color: getComputedStyle(document.body).getPropertyValue('--text-muted'),
          callback: value => `${value}M`
        }
      }
    }
  });

  // ====================== Initialize Everything ======================
  const init = () => {
    setupFAQAccordion();
    addButtonEffects();
    setupSmoothScrolling();
    setupThemeToggle();
    
    // Initialize animations when elements are in view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains('stats')) animateStats();
          if (entry.target.classList.contains('features')) animateFeatures();
          entry.target.classList.add('animate');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(section => {
      observer.observe(section);
    });

    // Initialize chart when in view
    const chartSection = document.querySelector('.ev-trend');
    if (chartSection) {
      const chartObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          initChart();
          chartObserver.disconnect();
        }
      }, { threshold: 0.1 });
      chartObserver.observe(chartSection);
    }
  };

  init();
});

// ====================== Utility Functions ======================
/**
 * Shows a temporary alert message
 * @param {string} message - The message to display
 * @param {string} type - Alert type ('success' or 'error')
 */
function showAlert(message, type = 'success') {
  const alert = document.createElement('div');
  alert.className = `alert ${type}`;
  alert.innerHTML = `
    <p>${message}</p>
    <span class="close-btn" aria-label="Close alert">&times;</span>
  `;
  
  document.body.appendChild(alert);
  
  // Style alert
  alert.style.position = 'fixed';
  alert.style.bottom = '20px';
  alert.style.right = '20px';
  alert.style.padding = '15px 25px';
  alert.style.borderRadius = '8px';
  alert.style.backgroundColor = type === 'success' ? '#00e676' : '#ff3d00';
  alert.style.color = '#020617';
  alert.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.2)';
  alert.style.zIndex = '1000';
  alert.style.display = 'flex';
  alert.style.alignItems = 'center';
  alert.style.gap = '15px';
  alert.style.animation = 'fadeInUp 0.3s ease-out';
  
  // Close button
  const closeBtn = alert.querySelector('.close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      alert.style.animation = 'fadeOutDown 0.3s ease-out';
      setTimeout(() => alert.remove(), 300);
    });
  }
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    alert.style.animation = 'fadeOutDown 0.3s ease-out';
    setTimeout(() => alert.remove(), 300);
  }, 5000);
}

// Add global animation styles
const addGlobalStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeOutDown {
      from { opacity: 1; transform: translateY(0); }
      to { opacity: 0; transform: translateY(20px); }
    }
    @keyframes pulse {
      0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0, 230, 118, 0.7); }
      70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(0, 230, 118, 0); }
      100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0, 230, 118, 0); }
    }
    .pulse { animation: pulse 1s; }
    .no-scroll { overflow: hidden; }
    
    /* Theme toggle button styles */
    .theme-toggle {
      position: fixed;
      bottom: 30px;
      right: 30px;
      z-index: 999;
    }
    #theme-btn {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: rgba(30, 41, 59, 0.9);
      border: none;
      color: #f8fafc;
      font-size: 1.2rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
      transition: all 0.3s ease;
    }
    #theme-btn:hover {
      transform: scale(1.1);
      background: rgba(0, 230, 118, 0.2);
    }
  `;
  document.head.appendChild(style);
};

// Initialize global styles
addGlobalStyles();