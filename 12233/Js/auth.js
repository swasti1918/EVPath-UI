// Firebase Configuration (replace with your actual config)
const firebaseConfig = {
  apiKey: "AIzaSyCQK_aWv5BkWMZuDiEw_s9U-rCM1EJVWlg",
  authDomain: "evpath-c20eb.firebaseapp.com",
  projectId: "evpath-c20eb",
  storageBucket: "evpath-c20eb.appspot.com",
  messagingSenderId: "185258770530",
  appId: "1:185258770530:web:bdad1d015e6eff8b40d13b"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// DOM Elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const googleBtn = document.querySelector('.btn-social.google');
const facebookBtn = document.querySelector('.btn-social.facebook');
const appleBtn = document.querySelector('.btn-social.apple');

// Form Submission
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = emailInput.value;
    const password = passwordInput.value;
    
    // Validate inputs
    if (!email || !password) {
      showAlert('Please fill in all fields', 'error');
      return;
    }
    
    // Show loading state
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
    
    // Sign in with email and password
    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log('User signed in:', user);
        
        // Redirect to dashboard or home page
        window.location.href = 'map.html';
      })
      .catch((error) => {
        // Handle errors
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Login error:', errorCode, errorMessage);
        
        // Show error message
        let message;
        switch (errorCode) {
          case 'auth/user-not-found':
            message = 'No account found with this email';
            break;
          case 'auth/wrong-password':
            message = 'Incorrect password';
            break;
          case 'auth/invalid-email':
            message = 'Invalid email address';
            break;
          default:
            message = 'Login failed. Please try again.';
        }
        
        showAlert(message, 'error');
      })
      .finally(() => {
        // Reset loading state
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign In';
      });
  });
}

// Google Sign-In
if (googleBtn) {
  googleBtn.addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    signInWithPopup(provider);
  });
}

// Facebook Sign-In
if (facebookBtn) {
  facebookBtn.addEventListener('click', () => {
    const provider = new firebase.auth.FacebookAuthProvider();
    signInWithPopup(provider);
  });
}

// Apple Sign-In (if needed)
if (appleBtn) {
  appleBtn.addEventListener('click', () => {
    const provider = new firebase.auth.OAuthProvider('apple.com');
    signInWithPopup(provider);
  });
}

// Sign in with provider using popup
function signInWithPopup(provider) {
  auth.signInWithPopup(provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = result.credential;
      const token = credential.accessToken;
      
      // The signed-in user info.
      const user = result.user;
      console.log('User signed in with provider:', user);
      
      // Redirect to dashboard or home page
      window.location.href = 'map.html';
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Provider sign-in error:', errorCode, errorMessage);
      
      // Show error message
      showAlert('Sign in failed. Please try another method.', 'error');
    });
}

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