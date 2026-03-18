document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const sellerLoginForm = document.getElementById('sellerLoginForm');
    const sellerSignupForm = document.getElementById('sellerSignupForm');
    
    const handleFormSubmit = (e, formId) => {
        e.preventDefault();
        
        const submitBtn = e.target.querySelector('.btn-primary');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        
        btnText.style.display = 'none';
        btnLoader.style.display = 'block';
        submitBtn.style.pointerEvents = 'none';
        
        const isSeller = formId.startsWith('seller');
        const actionType = formId.toLowerCase().includes('signup') ? 'signup' : 'login';
        
        let endpoint = '';
        if (isSeller) {
             endpoint = actionType === 'signup' ? `${window.API_URL}/seller/signup` : `${window.API_URL}/seller/login`;
        } else {
             endpoint = actionType === 'signup' ? `${window.API_URL}/auth/signup` : `${window.API_URL}/auth/login`;
        }
        
        let payload = {};
        
        if (isSeller) {
            payload.email = document.getElementById('sellerEmail').value;
            payload.password = document.getElementById('sellerPassword').value;
            
            if (actionType === 'signup') {
                payload.name = document.getElementById('sellerName').value;
                const confirmPassword = document.getElementById('sellerConfirmPassword').value;
                
                if (payload.password !== confirmPassword) {
                    alert("Passwords do not match!");
                    btnLoader.style.display = 'none';
                    btnText.style.display = 'block';
                    submitBtn.style.pointerEvents = 'auto';
                    return;
                }
            }
        } else {
            payload.email = document.getElementById('email').value;
            payload.password = document.getElementById('password').value;
            
            if (actionType === 'signup') {
                payload.username = document.getElementById('username').value;
                const confirmPassword = document.getElementById('confirmPassword').value;
                
                if (payload.password !== confirmPassword) {
                    alert("Passwords do not match!");
                    btnLoader.style.display = 'none';
                    btnText.style.display = 'block';
                    submitBtn.style.pointerEvents = 'auto';
                    return;
                }
            }
        }
            
        fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(res => {
            if(!res.ok) {
                return res.json().then(err => { throw new Error(err.message || 'Authentication Failed'); });
            }
            return res.json();
        })
        .then(data => {
            btnLoader.style.display = 'none';
            btnText.style.display = 'block';
            btnText.innerText = 'Success!';
            
            if(actionType === 'signup') {
                submitBtn.style.background = 'linear-gradient(to right, #f83600, #96c93d)';
            } else {
                submitBtn.style.background = 'linear-gradient(to right, #00b09b, #96c93d)';
                
                localStorage.removeItem('token');
                localStorage.removeItem('username');
                localStorage.removeItem('sellerToken');
                localStorage.removeItem('sellerName');
                
                if (isSeller) {
                    localStorage.setItem('sellerToken', data.token);
                    localStorage.setItem('sellerName', data.seller.name);
                } else {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('username', data.user.username);
                }
            }
            
            setTimeout(() => {
                if (actionType === 'login') {
                    if (isSeller) {
                        window.location.href = 'seller-dashboard.html';
                    } else {
                        window.location.href = 'index.html'; 
                    }
                } else if (actionType === 'signup') {
                    window.location.href = isSeller ? 'seller-login.html' : 'login.html';
                }
                
                btnText.innerText = actionType === 'signup' ? 'Create Account' : 'Sign In';
                submitBtn.style.background = '';
                submitBtn.style.pointerEvents = 'auto';
            }, 1000);
        })
        .catch(err => {
            if (err.message.includes('already registered')) {
                alert(`${err.message}. Please click the 'Login' link below instead!`);
            } else {
                alert(err.message);
            }
            
            btnLoader.style.display = 'none';
            btnText.style.display = 'block';
            btnText.innerText = 'Failed';
            submitBtn.style.background = 'linear-gradient(to right, #ff416c, #ff4b2b)';
            
            setTimeout(() => {
                btnText.innerText = actionType === 'signup' ? 'Create Account' : 'Sign In';
                submitBtn.style.background = '';
                submitBtn.style.pointerEvents = 'auto';
            }, 2000);
        });
    };

    if(loginForm) loginForm.addEventListener('submit', (e) => handleFormSubmit(e, 'loginForm'));
    if(signupForm) signupForm.addEventListener('submit', (e) => handleFormSubmit(e, 'signupForm'));
    if(sellerLoginForm) sellerLoginForm.addEventListener('submit', (e) => handleFormSubmit(e, 'sellerLoginForm'));
    if(sellerSignupForm) sellerSignupForm.addEventListener('submit', (e) => handleFormSubmit(e, 'sellerSignupForm'));

    document.addEventListener('mousemove', (e) => {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 50;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 50;
        
        const card = document.querySelector('.auth-card');
        if(card) {
            card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        }
    });
});
