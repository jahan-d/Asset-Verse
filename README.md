# AssetVerse - Employee Asset Management System

<div align="center">

![AssetVerse Logo](https://assetverse-16573.web.app/logo.png)

**A modern, full-stack employee asset management platform for HR professionals**

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://assetverse-16573.web.app/)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

[Features](#features) • [Tech Stack](#tech-stack) • [Getting Started](#getting-started) • [Screenshots](#screenshots)

</div>

---

## 📋 Overview

AssetVerse is a comprehensive employee asset management system designed to streamline HR operations. It provides role-based access control, package-based employee limits, and seamless asset tracking capabilities.

### 🎯 Key Features

- **Role-Based Access Control**: Separate dashboards for HR Managers and Employees
- **Package Management**: Flexible subscription tiers (5, 10, 20 employees) with Stripe integration
- **Asset Management**: Create, update, and track custom or limited stock assets
- **Employee Operations**: Add/remove team members, request assets, and track availability
- **Real-Time Updates**: Live employee count display and instant UI synchronization
- **Premium UI/UX**: Modern design with Framer Motion animations and corporate theme

---

## 🚀 Features

### For HR Managers
- 📊 **Dashboard-Lite**: Quick stats showing employee count, package limits, pending requests, and assets
- 👥 **Team Management**: Add/remove employees with real-time capacity tracking
- 💰 **Package Upgrades**: Seamless Stripe payment integration with instant limit updates
- 📦 **Asset Creation**: Define custom or limited stock assets with image, type, and availability
- ✅ **Request Approval**: Approve or reject employee asset requests

### For Employees
- 📝 **Asset Requests**: Browse and request available assets
- 📋 **My Assets**: View all requested assets with status, dates, and approval info
- ✨ **Modern UI**: Smooth animations and intuitive navigation

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - Latest React with concurrent features
- **Vite** - Lightning-fast build tool
- **Tailwind CSS 4** - Utility-first CSS framework
- **DaisyUI** - Component library (Corporate theme)
- **Framer Motion** - Smooth animations and transitions
- **React Query (TanStack Query)** - Server state management
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Firebase Authentication** - Secure user authentication

### Backend
- **Node.js** + **Express.js** - RESTful API server
- **MongoDB** + **Mongoose** - NoSQL database
- **JWT** - Token-based authentication
- **Stripe API** - Payment processing
- **Firebase Admin SDK** - Server-side auth verification

### Deployment
- **Firebase Hosting** - Frontend hosting
- **Vercel** - Backend API hosting

---

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- MongoDB instance (local or Atlas)
- Firebase project with Authentication enabled
- Stripe account for payments

### Environment Variables

#### Frontend (`.env`)
```env
VITE_API_URL=your_backend_url
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_STRIPE_PK=your_stripe_publishable_key
```

#### Backend (`.env`)
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
FIREBASE_SERVICE_ACCOUNT=path_to_service_account.json
```

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/assetverse.git
cd assetverse

# Install backend dependencies
cd backend/server
npm install

# Install frontend dependencies  
cd ../../client/AssetVerse
npm install

# Start backend (from backend/server)
npm run dev

# Start frontend (from client/AssetVerse)
npm run dev
```

---

## 📸 Screenshots

![AssetVerse Home Dashboard](./screenshots/home.png)

> **See the live application**: Visit [https://assetverse-16573.web.app/](https://assetverse-16573.web.app/) to see AssetVerse in action!

The application features:
- Modern dashboard with employee stats and package limits
- Asset management interface with request tracking
- Team management with real-time updates
- Stripe payment integration for package upgrades

---

## 🔐 Security Features

- Firebase Authentication with email/password
- JWT-based API authentication
- Role-based middleware (`requireRole`)
- Secure payment processing with Stripe
- Environment variable protection

---

## 📄 API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/register` | Register new user | No |
| `POST` | `/api/auth/login` | Login user | No |
| `GET` | `/api/users/me` | Get current user | Yes |
| `GET` | `/api/employees` | Get all employees | HR Only |
| `POST` | `/api/employees` | Add employee | HR Only |
| `DELETE` | `/api/employees/:id` | Remove employee | HR Only |
| `GET` | `/api/assets` | Get all assets | Yes |
| `POST` | `/api/assets` | Create asset | HR Only |
| `POST` | `/api/requests` | Request asset | Employee |
| `GET` | `/api/requests` | Get user requests | Yes |
| `PATCH` | `/api/requests/:id/approve` | Approve request | HR Only |
| `POST` | `/api/payments/create` | Create payment intent | HR Only |
| `POST` | `/api/payments/verify` | Verify payment | HR Only |

---

## 🎨 Design System

- **Theme**: DaisyUI Corporate (light, professional)
- **Colors**: Blue primary, neutral grays
- **Typography**: Inter font family
- **Components**: Cards, modals, tables, forms
- **Animations**: Framer Motion for smooth transitions

---

## 👨‍💻 Author

**Jahan**
- Portfolio: [jahan-d.web.app](https://jahan-d.web.app)
- GitHub: [@yourusername](https://github.com/yourusername)

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- React team for React 19
- Tailwind Labs for Tailwind CSS & DaisyUI
- Vercel for hosting
- Firebase for authentication
- Stripe for payment processing

---

<div align="center">
Made with ❤️ by Jahan
</div>
