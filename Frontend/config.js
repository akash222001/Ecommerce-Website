const CONFIG = {
    // Dynamically determine the API URL
    // If running on localhost (development), use localhost:3000
    // If running on a production URL, you can either hardcode the Render URL here
    // or use a logic to detect it.
    // API_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    //     ? 'http://localhost:3000'
    //     : 'https://YOUR_RENDER_BACKEND_URL_HERE' // Replace this after deploying to Render
    API_URL: 'https://ecommerce-website-backend-bnnq.onrender.com'
};

window.API_URL = CONFIG.API_URL;
