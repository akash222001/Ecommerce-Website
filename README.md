# 🛒 Modern eCommerce - Full Stack Application

A robust, full-stack eCommerce platform featuring a modern design, Dockerized infrastructure, and Razorpay payment integration.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-ISC-green)

---

## 🚀 Key Features

- **User Authentication**: Secure signup and login for both Customers and Sellers (JWT-based).
- **Product Management**: Sellers can add, update, and manage their inventory.
- **Shopping Cart**: Real-time cart management for customers.
- **Secure Payments**: Integrated with **Razorpay** for seamless transactions.
- **Dockerized Environment**: Fully containerized with health-checked MySQL, backend, and frontend services.
- **Responsive UI**: Premium, modern interface with smooth micro-animations.

## 🛠 Tech Stack

- **Frontend**: HTML5, Vanilla CSS3, JavaScript (ES6+), Fetch API.
- **Backend**: Node.js, Express.js.
- **ORM**: Sequelize (MySQL).
- **Infrastructure**: Docker, Docker Compose.
- **Payments**: Razorpay Node SDK.

---

## 📦 Getting Started

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed.
- A [Razorpay](https://razorpay.com/) account for API keys.

### 1. Setup Environment Variables

Create a `.env` file in the root directory and add the following (copy from `.env.example` if available):

```env
# Database
MYSQL_DATABASE=ecommerce_db
MYSQL_USER=ecommerce_user
MYSQL_PASSWORD=ecommerce_password
MYSQL_ROOT_PASSWORD=root_password

# Server
PORT=3000
DB_HOST=db

# Auth
JWT_USER_SECRET=your_user_secret
JWT_SELLER_SECRET=your_seller_secret

# Razorpay
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

### 2. Run with Docker

Launch the entire stack with a single command:

```bash
docker compose up --build
```

- **Frontend**: [http://localhost:8080](http://localhost:8080)
- **Backend API**: [http://localhost:3000](http://localhost:3000)

---

## 🏗 Project Structure

```text
├── Backend/           # Express Server & Sequelize Models
├── Frontend/          # HTML, CSS, and Client-side JS
├── docker-compose.yml # Service Orchestration
└── .env               # Environment configuration
```

## 🔒 Security Note

- **Environment Variables**: Never commit your `.env` file to GitHub. It is already included in `.gitignore`.
- **Database**: The database port is internally mapped and port `3307` is exposed for local management tools.

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
