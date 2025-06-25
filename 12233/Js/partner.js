document.addEventListener('DOMContentLoaded', function() {
  // ========== Form Validation ==========
  const partnerForm = document.getElementById('partnerForm');
  if (partnerForm) {
    partnerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form elements
      const companyName = document.getElementById('company-name');
      const contactName = document.getElementById('contact-name');
      const email = document.getElementById('email');
      const interest = document.getElementById('interest');
      
      // Validate required fields
      let isValid = true;
      
      if (!companyName.value.trim()) {
        showError(companyName, 'Company name is required');
        isValid = false;
      }
      
      if (!contactName.value.trim()) {
        showError(contactName, 'Contact name is required');
        isValid = false;
      }
      
      if (!email.value.trim()) {
        showError(email, 'Email is required');
        isValid = false;
      } else if (!isValidEmail(email.value)) {
        showError(email, 'Please enter a valid email');
        isValid = false;
      }
      
      if (!interest.value) {
        showError(interest, 'Please select interest level');
        isValid = false;
      }
      
      if (isValid) {
        // Show loading state
        const submitBtn = partnerForm.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';
        
        // Simulate form submission
        setTimeout(() => {
          // In a real app, you would send the form data to your server here
          console.log('Form submitted:', {
            company: companyName.value,
            contact: contactName.value,
            email: email.value,
            phone: document.getElementById('phone').value,
            stations: document.getElementById('stations').value,
            interest: interest.value,
            message: document.getElementById('message').value
          });
          
          // Show success message
          showAlert('Thank you for your partnership application! We will contact you within 24 hours.', 'success');
          
          // Reset form
          partnerForm.reset();
          
          // Reset button state
          btnText.style.display = 'inline-block';
          btnLoader.style.display = 'none';
        }, 1500);
      }
    });
  }
  
  // ========== FAQ Accordion ==========
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length > 0) {
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      const icon = question.querySelector('i');
      
      question.addEventListener('click', () => {
        // Toggle current item
        const isOpen = item.classList.toggle('active');
        
        // Toggle answer visibility
        if (isOpen) {
          answer.style.maxHeight = answer.scrollHeight + 'px';
          if (icon) icon.classList.replace('fa-chevron-down', 'fa-chevron-up');
        } else {
          answer.style.maxHeight = '0';
          if (icon) icon.classList.replace('fa-chevron-up', 'fa-chevron-down');
        }
        
        // Close other items
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
            const otherAnswer = otherItem.querySelector('.faq-answer');
            const otherIcon = otherItem.querySelector('.faq-question i');
            if (otherAnswer) otherAnswer.style.maxHeight = '0';
            if (otherIcon) otherIcon.classList.replace('fa-chevron-up', 'fa-chevron-down');
          }
        });
      });
    });
  }
  
  // ========== Tier Card Selection ==========
  const tierCards = document.querySelectorAll('.tier-card');
  if (tierCards.length > 0) {
    tierCards.forEach(card => {
      const button = card.querySelector('button');
      if (button) {
        button.addEventListener('click', function() {
          // Remove active class from all cards
          tierCards.forEach(c => c.classList.remove('selected'));
          
          // Add active class to clicked card
          card.classList.add('selected');
          
          // Pulse animation
          this.classList.add('pulse');
          setTimeout(() => {
            this.classList.remove('pulse');
          }, 500);
          
          // For demo purposes - in a real app this would redirect or show more info
          if (card.classList.contains('featured')) {
            showAlert('You selected our Pro partnership plan', 'success');
          } else if (card.querySelector('.tier-price').textContent === 'Custom') {
            document.getElementById('interest').value = 'enterprise';
            document.querySelector('.partner-form-section').scrollIntoView({
              behavior: 'smooth'
            });
          }
        });
      }
    });
  }
  
  // ========== Helper Functions ==========
  function showError(input, message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = '#ff3d00';
    errorElement.style.fontSize = '0.8rem';
    errorElement.style.marginTop = '0.25rem';
    
    // Remove existing error if any
    const existingError = input.nextElementSibling;
    if (existingError && existingError.classList.contains('error-message')) {
      existingError.remove();
    }
    
    input.insertAdjacentElement('afterend', errorElement);
    input.focus();
  }
  
  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
  
  function showAlert(message, type = 'success') {
    const alert = document.createElement('div');
    alert.className = `alert ${type}`;
    alert.innerHTML = `
      <p>${message}</p>
      <span class="close-btn">&times;</span>
    `;
    
    document.body.appendChild(alert);
    
    // Position and style
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
});

// Add global styles for alerts
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
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  .pulse { animation: pulse 0.5s; }
  
  /* Error message styles */
  .error-message {
    color: #ff3d00 !important;
    font-size: 0.8rem;
    margin-top: 0.25rem;
    display: block;
  }
  
  /* Form loading state */
  .btn-loader {
    display: none;
  }
`;
document.head.appendChild(style);