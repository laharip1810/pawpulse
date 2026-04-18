# 🐾 PawPulse — Smart Pet Care Management System

> *"Because your pet deserves the best care, every single day."*

---

## 🏷️ Suggested App Names
| Name | Meaning |
|------|---------|
| **PawPulse** | Tracks the health "pulse" of your pet — smart, modern, caring |
| **PetNest** | A safe, warm home for all pet data — cozy and trusted |
| **FurGuard** | Guardian intelligence for your furry family member |

---

## 📌 Project Overview

**PawPulse** is a full-stack Pet Care Management System built with:
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (SPA-style)
- **Backend**: Node.js + Express.js (REST API)
- **Database**: MongoDB + Mongoose
- **Auth**: JWT + bcrypt
- **Deployment**: Render (backend) + Netlify (frontend)

---

## 🗂️ Folder Structure

```
pawpulse/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Register, Login, GetMe
│   │   ├── petController.js      # CRUD, vaccinations, logs
│   │   ├── healthController.js   # Symptom checker
│   │   └── adminController.js    # Admin operations
│   ├── middleware/
│   │   └── auth.js               # JWT protect + adminOnly
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Pet.js                # Pet schema + vaccine schedule
│   │   ├── DailyLog.js           # Food/water logs
│   │   └── HealthCheck.js        # Health check records
│   ├── routes/
│   │   ├── auth.js
│   │   ├── pets.js
│   │   ├── health.js
│   │   └── admin.js
│   ├── server.js                 # Express app entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── css/
│   │   └── style.css             # Complete styling
│   ├── js/
│   │   └── api.js                # All API calls + utilities
│   ├── pages/
│   │   ├── login.html
│   │   ├── register.html
│   │   ├── dashboard.html
│   │   ├── add-pet.html
│   │   ├── health.html
│   │   └── admin.html
│   └── index.html                # Landing page
│
├── render.yaml                   # Render deployment config
├── .gitignore
└── README.md
```

---

## 🔗 API Endpoints

### Auth Routes (`/api/auth`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | Login user or admin | Public |
| GET | `/me` | Get current user | 🔒 Private |

### Pet Routes (`/api/pets`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Get all user's pets | 🔒 Private |
| POST | `/` | Add new pet | 🔒 Private |
| GET | `/:id` | Get single pet | 🔒 Private |
| PUT | `/:id` | Update pet | 🔒 Private |
| DELETE | `/:id` | Delete pet | 🔒 Private |
| PUT | `/:id/vaccinations/:vacId` | Mark vaccination done | 🔒 Private |
| GET | `/:id/logs` | Get daily logs | 🔒 Private |
| POST | `/:id/logs` | Add daily log | 🔒 Private |

### Health Routes (`/api/health`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/check` | Check symptoms → diagnosis | 🔒 Private |
| GET | `/:petId` | Get health check history | 🔒 Private |

### Admin Routes (`/api/admin`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/stats` | Dashboard statistics | 🛡️ Admin |
| GET | `/users` | All users | 🛡️ Admin |
| DELETE | `/users/:id` | Delete user + data | 🛡️ Admin |
| GET | `/pets` | All pets | 🛡️ Admin |
| DELETE | `/pets/:id` | Delete pet | 🛡️ Admin |

---

## ⚙️ Local Setup Guide

### Step 1: Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/pawpulse.git
cd pawpulse
```

### Step 2: Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your values (see below)
```

### Step 3: Configure `.env`
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/pawpulse
JWT_SECRET=your_super_secret_key_here
ADMIN_EMAIL=admin@pawpulse.com
ADMIN_PASSWORD=Admin@123
NODE_ENV=development
```

### Step 4: Run Backend
```bash
npm run dev
# Server starts at http://localhost:5000
# You should see: ✅ MongoDB Connected and 🚀 PawPulse Server running on port 5000
```

### Step 5: Serve Frontend
```bash
# Option A: Open index.html directly in browser (file://)
# Option B: Use VS Code Live Server extension
# Option C: Use npx serve
cd ../frontend
npx serve .
```

---

## 🗄️ MongoDB Atlas Setup

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create free M0 cluster
3. Create database user (username + password)
4. Network Access → Add IP Address → Allow from Anywhere (`0.0.0.0/0`)
5. Connect → Drivers → Copy connection string
6. Replace `<password>` with your DB user password
7. Paste into `.env` as `MONGO_URI`

---

## 🚀 Deployment Guide

### Backend → Render (Free)

1. Push code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect GitHub repo
4. Settings:
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
5. Environment Variables → Add all from `.env`
6. Deploy → Copy your URL (e.g., `https://pawpulse-backend.onrender.com`)

### Frontend → Netlify (Free)

1. Update `API_BASE` in `frontend/js/api.js`:
   ```js
   const API_BASE = 'https://pawpulse-backend.onrender.com/api';
   ```
2. Go to [netlify.com](https://netlify.com) → New Site from Git
3. Connect GitHub → select repo
4. **Publish directory**: `frontend`
5. Deploy → Your site is live!

---

## 🧪 Demo Script for Faculty

### 1️⃣ Show Server Running
```bash
cd backend && npm run dev
# Faculty sees: ✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
# Faculty sees: 🚀 PawPulse Server running on port 5000
```

### 2️⃣ Test API with Status Check
Open browser: `http://localhost:5000/api/status`
```json
{
  "status": "✅ PawPulse Server Running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development"
}
```

### 3️⃣ Register a User (show network tab)
- Open `frontend/pages/register.html`
- Open DevTools → Network tab
- Register with name/email/password
- Show POST request to `/api/auth/register`
- Show JWT token in response
- Show user in MongoDB Atlas

### 4️⃣ Add a Pet + Auto Vaccines
- Login → Dashboard → Add Pet
- Select Dog, enter details → Submit
- Show in MongoDB: pet has vaccinations[] auto-populated
- Dashboard shows vaccine alerts

### 5️⃣ Health Checker
- Click Health Check
- Select pet → click symptom tags (e.g., "Vomiting", "Lethargic")
- Submit → Show diagnosis card
- Show HealthCheck record in MongoDB

### 6️⃣ Admin Panel
- Logout → Login as admin@pawpulse.com / Admin@123
- Show all users and pets table
- Demonstrate delete functionality

---

## 🎨 Design Choices

### Color Theme
| Color | Hex | Usage |
|-------|-----|-------|
| Teal | `#0D9488` | Primary brand, buttons, accents |
| Amber | `#F59E0B` | Warnings, logging, secondary actions |
| Rose | `#F43F5E` | Danger, delete, emergency |
| Indigo | `#6366F1` | Info badges, step indicators |

### Logo Idea
- Paw print `🐾` with a heartbeat/pulse line running through it
- Colors: White paw on teal circle background
- Font: Playfair Display for "PawPulse"
- Can be made in Canva or Figma

### UI Improvements for Production
1. Add pet photo upload (Cloudinary)
2. Push notifications for vaccine reminders (Web Push API)
3. Vet locator map nearby (Google Maps API)
4. PDF health report download
5. Mobile app version (React Native)
6. Multi-pet family sharing

---

## 👨‍💻 Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose ODM |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Deployment | Render (BE), Netlify (FE) |
| Dev Tools | nodemon, dotenv, cors |

---

## 📄 License
MIT License — Free to use for educational and commercial purposes.

---

*Built with ❤️ by the PawPulse Team — Because every paw deserves a pulse check.*
