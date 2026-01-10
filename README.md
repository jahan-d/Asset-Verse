# AssetVerse

<div align="center">

![AssetVerse HR Platform](https://assetverse-16573.web.app/logo.png)

**A modern, full-stack employee asset management system for HR professionals.**

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge&logo=firebase)](https://assetverse-16573.web.app/)
[![Server API](https://img.shields.io/badge/API-live-success?style=for-the-badge&logo=vercel)](https://assetverse-three.vercel.app/)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)

[Features](#features) • [Tech Stack](#tech-stack) • [Installation](#installation) • [Deployment](#deployment)

</div>

---

## 📋 Overview

**AssetVerse** revolutionizes how organizations track assets. Tailored for HR managers, it simplifies the complex process of asset allocation, tracking, and retrieval. With a focus on usability and design, it ensures that managing company resources is effortless and transparent.

### 🌟 Key Highlights
- **Smart HR Dashboard**: Instant insights into asset distribution and pending requests.
- **Employee Portal**: A dedicated space for employees to request and track assets.
- **Subscription Models**: Tiered packages for companies of different sizes (5/10/20 employees).
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
- MongoDB Atlas URI
- Firebase Project
- Stripe Account

### 1. Clone the Repository
```bash
git clone https://github.com/jahan-d/Asset-Verse.git
cd Asset-Verse
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
MONGO_URI=<YOUR_MONGODB_URI>
JWT_SECRET=<YOUR_JWT_SECRET>
STRIPE_SECRET_KEY=<YOUR_STRIPE_SECRET_KEY>
FIREBASE_SERVICE_ACCOUNT=<YOUR_SERVICE_ACCOUNT_JSON>
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

Create a `.env` file in `client/AssetVerse` using your Firebase credentials:
```env
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=<YOUR_FIREBASE_API_KEY>
VITE_FIREBASE_AUTH_DOMAIN=assetverse-16573.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=assetverse-16573
VITE_FIREBASE_STORAGE_BUCKET=assetverse-16573.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=<YOUR_SENDER_ID>
VITE_FIREBASE_APP_ID=<YOUR_APP_ID>
VITE_STRIPE_PK=<YOUR_STRIPE_PUBLISHABLE_KEY>
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

## 👨‍💻 Author

**Jahan**
- Portfolio: [jahan-d.web.app](https://jahan-d.web.app)
- GitHub: [@jahan-d](https://github.com/jahan-d)

---

## 📄 License
This project is licensed under the MIT License.
