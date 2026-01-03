# AssetVerse 🏢
**Corporate Asset Management System**

A full-stack web application designed for HR Managers to track company assets and for Employees to request and manage distributed equipment. Built with the MERN stack, adhering to strict clean architecture principles.

---

## 🚀 Features

### 👨‍💼 HR Manager (Admin)
- **Asset Management**: Add, update, and delete company assets (track quantity, type).
- **Request Handling**: efficient Approve/Reject workflow for employee requests.
- **Team Management**: View affiliated employees and remove members.
- **Package Limits**: Enforced limits on team size based on subscription plan.
- **Payments**: Integrated **Stripe** for package upgrades (Basic/Standard/Premium).

### 👷 Employee (User)
- **Request Assets**: Browse available inventory and submit requests with notes.
- **My Assets**: View assigned items, status, and return "Returnable" assets.
- **My Team**: View colleagues and upcoming birthdays.
- **PDF Report**: Generate print-ready views of assigned assets.

---

## 🛠️ Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, DaisyUI, TanStack Query, Axios.
- **Backend**: Node.js, Express.js, MongoDB (Native Driver), JWT.
- **Auth**: Firebase Authentication (Strict Email/Password) + Custom Role Management.
- **Payments**: Stripe Payment Gateway.

---

## ⚙️ Installation & Setup

### 1. clone the Repository
\`\`\`bash
git clone https://github.com/Start-0/AssetVerse.git
cd AssetVerse
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd backend/server
npm install
\`\`\`
- Create a \`.env\` file in \`backend/server/\`:
  \`\`\`env
  PORT=5000
  MONGO_URI=your_mongodb_connection_string
  JWT_SECRET=your_secure_random_string
  STRIPE_SECRET_KEY=sk_test_...
  \`\`\`
- **Important**: Place your **Firebase Admin Key** (\`serviceAccountKey.json\`) inside \`backend/server/\`.

### 3. Client Setup
\`\`\`bash
cd client/AssetVerse
npm install
\`\`\`
- Create a \`.env\` file in \`client/AssetVerse/\`:
  \`\`\`env
  VITE_API_URL=http://localhost:5000
  VITE_FIREBASE_API_KEY=...
  VITE_FIREBASE_AUTH_DOMAIN=...
  VITE_FIREBASE_PROJECT_ID=...
  # ... (other firebase config keys)
  \`\`\`

---

## 🏃‍♂️ Running the App

**Start Backend** (Terminal 1):
\`\`\`bash
cd backend/server
npm start
\`\`\`

**Start Frontend** (Terminal 2):
\`\`\`bash
cd client/AssetVerse
npm run dev
\`\`\`

---

## 🔐 Credentials
- **HR Account**: Sign up via \`/join-hr\` (First user is automatically HR if seeding logic allows, or just use the specific registration page).
- **Employee Account**: Sign up via \`/join-employee\`.

---
*Built as a Final Project Requirement.*
