# AssetVerse

<div align="center">

![AssetVerse HR Platform](https://assetverse-16573.web.app/logo.png)

**A modern, full-stack employee asset management system for HR professionals.**

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge&logo=firebase)](https://assetverse-16573.web.app/)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)

[Features](#features) • [Tech Stack](#tech-stack) • [Installation](#installation) • [Deployment](#deployment)

</div>

---

## 📋 Overview

**AssetVerse** revolutionizes how organizations track assets. tailored for HR managers, it simplifies the complex process of asset allocation, tracking, and retrieval. With a focus on usability and design, it ensures that managing company resources is effortless and transparent.

### 🌟 Key Highlights
- **Smart HR Dashboard**: Instant insights into asset distribution and pending requests.
- **Employee Portal**: A dedicated space for employees to request and track assets.
- **Subscription Models**: tiered packages for companies of different sizes (5/10/20 employees).
- **Automated Tracking**: Real-time status updates for every piece of equipment.

---

## 🚀 Features

### 👔 For HR Managers
- **Asset Inventory**: Add, update, and categorize company assets.
- **Team Management**: Onboard employees and manage team limits based on packages.
- **Request Processing**: One-click approval or rejection of asset requests.
- **Payment Integration**: Seamless package upgrades via Stripe.

### 💼 For Employees
- **Catalog Browsing**: View available assets and their details.
- **One-Click Requests**: Simple procedure to request needed equipment.
- **My Assets**: Track possession and return dates.
- **Profile Management**: Update personal details and status.

---

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework**: React.js 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4, DaisyUI
- **Animations**: Framer Motion
- **State Management**: TanStack Query
- **Authentication**: Firebase Auth

### Backend (Server)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT & Firebase Admin SDK
- **Payments**: Stripe API
- **Reporting**: PDF Generation

---

## 📦 Installation

Follow these steps to run the project locally.

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas
- Firebase Project
- Stripe Account

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/assetverse.git
cd assetverse
```

### 2. Server Setup
Navigate to the server directory:
```bash
cd backend/server
npm install
```

Create a `.env` file in `backend/server`:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret
FIREBASE_SERVICE_ACCOUNT=your_service_account_json
```

Start the server:
```bash
npm run dev
```

### 3. Client Setup
Navigate to the client directory:
```bash
cd client/AssetVerse
npm install
```

Create a `.env` file in `client/AssetVerse`:
```env
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_STRIPE_PK=your_stripe_publishable_key
```

Start the client:
```bash
npm run dev
```

---

## ☁️ Deployment

### Server (Vercel)
1. Initialize in `backend/server`: `vercel`
2. Set environment variables in Vercel.
3. Deploy: `vercel --prod`

### Client (Firebase)
1. Initialize in `client/AssetVerse`: `firebase init hosting`
2. Build: `npm run build`
3. Deploy: `firebase deploy`

---

## 📄 License
This project is licensed under the MIT License.
