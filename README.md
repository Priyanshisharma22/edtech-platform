# 📚 E-Learning Platform — Backend API

A RESTful backend API built with **Node.js**, **Express**, and **MongoDB** for an e-learning platform supporting authentication, course management, enrollment, payments, and progress tracking.

---

## 🚀 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose)
- **Payment:** Stripe (Checkout Sessions)
- **Environment:** dotenv

---

## 📁 Project Structure

```
├── routes/
│   ├── auth.js          # Authentication (register, login)
│   ├── courses.js       # Course CRUD operations
│   ├── profile.js       # User profile management
│   ├── enroll.js        # Course enrollment
│   ├── cart.js          # Shopping cart
│   ├── progress.js      # Course progress tracking
│   ├── certificate.js   # Certificate generation
│   └── payment.js       # Stripe payment integration
├── uploads/             # Static uploaded files
├── .env                 # Environment variables
└── server.js            # Entry point
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- Stripe account (for payments)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd <project-folder>

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
MONGO_URI=mongodb://localhost:27017/elearning
STRIPE_SECRET_KEY=sk_test_your_stripe_key
```

### Run the Server

```bash
# Development
node server.js

# With auto-reload (recommended)
npx nodemon server.js
```

Server runs at: `http://localhost:5000`

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get token |
| GET | `/api/courses` | Get all courses |
| POST | `/api/courses` | Create a course |
| GET | `/api/profile` | Get user profile |
| PUT | `/api/profile` | Update user profile |
| POST | `/api/enroll` | Enroll in a course |
| GET | `/api/cart` | Get cart items |
| POST | `/api/cart` | Add to cart |
| GET | `/api/progress` | Get course progress |
| POST | `/api/progress` | Update progress |
| GET | `/api/certificate` | Get certificate |
| POST | `/api/payment/create-checkout` | Create Stripe checkout session |

---

## 🌐 CORS

The API is configured to accept requests from:

```
http://localhost:5173
```

> Update the CORS origin in `server.js` if your frontend runs on a different port.

---

## 📦 Static Files

Uploaded files (images, videos, etc.) are served from:

```
http://localhost:5000/uploads/<filename>
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.
