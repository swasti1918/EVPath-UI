// Contact Form Handling
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form values
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());
      
      // In a real app, you would send this to your server
      console.log('Form submitted:', data);
      
      // Show success message
      showAlert('Thank you for your message! We will get back to you soon.', 'success');
      
      // Reset form
      contactForm.reset();
    });
  }
  
  // FAQ Accordion
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const answer = item.querySelector('.faq-answer');
      const icon = question.querySelector('i');
      
      // Toggle active class
      item.classList.toggle('active');
      
      // Toggle answer visibility
      if (item.classList.contains('active')) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
      } else {
        answer.style.maxHeight = '0';
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
      }
      
      // Close other items
      faqQuestions.forEach(q => {
        if (q !== question) {
          const otherItem = q.parentElement;
          const otherAnswer = otherItem.querySelector('.faq-answer');
          const otherIcon = q.querySelector('i');
          
          otherItem.classList.remove('active');
          otherAnswer.style.maxHeight = '0';
          otherIcon.classList.remove('fa-chevron-up');
          otherIcon.classList.add('fa-chevron-down');
        }
      });
    });
  });
});

// Show alert message
function showAlert(message, type) {
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.textContent = message;
  
  document.body.appendChild(alert);
  
  // Position the alert
  alert.style.position = 'fixed';
  alert.style.bottom = '20px';
  alert.style.right = '20px';
  alert.style.padding = '1rem 2rem';
  alert.style.borderRadius = '0.5rem';
  alert.style.backgroundColor = type === 'success' ? '#00e676' : '#ff3d00';
  alert.style.color = '#fff';
  alert.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
  alert.style.zIndex = '1000';
  alert.style.animation = 'fadeIn 0.3s ease-out';
  
  // Remove alert after 5 seconds
  setTimeout(() => {
    alert.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => {
      alert.remove();
    }, 300);
  }, 5000);
}

// Add animation for alerts
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeOut {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(20px); }
  }
`;
document.head.appendChild(style);