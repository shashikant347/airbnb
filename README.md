# 🏠 Airbnb Clone — Full Stack Application

A complete **Airbnb Clone** built with **React (Vite) + Tailwind CSS** frontend and **Node.js + Express + MongoDB** backend.

---

## 🛠 Tech Stack

| Layer      | Technology                              |
|------------|----------------------------------------|
| Frontend   | React 18, Vite 5, Tailwind CSS 3       |
| Backend    | Node.js, Express.js 4                  |
| Database   | MongoDB + Mongoose 8                   |
| Auth       | JWT (Access + Refresh tokens)          |
| Images     | Cloudinary (upload ready)              |
| Payments   | Stripe (structure ready)               |

---

## 📁 Project Structure

```
airbnb/
├── backend/
│   ├── src/
│   │   ├── config/         # DB & Cloudinary config
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/      # Auth, error, upload
│   │   ├── models/          # Mongoose schemas (5 models)
│   │   ├── routes/          # API routes
│   │   ├── utils/           # ApiError, seed script
│   │   └── server.js        # Express entry point
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios instance
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # Auth Context
│   │   ├── layouts/         # MainLayout
│   │   ├── pages/           # All page components
│   │   ├── App.jsx          # Routes
│   │   └── main.jsx         # Entry point
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
└── README.md
```

---

## 🚀 Quick Setup

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```


This creates:
- 👤 **User**: user@demo.com / password123
- 🏠 **Host**: host@demo.com / password123
- 🔑 **Admin**: admin@demo.com / admin123
- 8 sample property listings

### 4. Run

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```


## 📡 API Endpoints

### Auth
| Method | Endpoint                | Description      |
|--------|------------------------|------------------|
| POST   | /api/auth/register      | Register user    |
| POST   | /api/auth/login         | Login            |
| POST   | /api/auth/logout        | Logout           |
| GET    | /api/auth/me            | Get current user |
| POST   | /api/auth/refresh-token | Refresh JWT      |

### Users
| Method | Endpoint                   | Description       |
|--------|---------------------------|-------------------|
| GET    | /api/users/profile         | Get profile       |
| PUT    | /api/users/profile         | Update profile    |
| PUT    | /api/users/change-password | Change password   |

### Properties
| Method | Endpoint                    | Description            |
|--------|----------------------------|------------------------|
| GET    | /api/properties             | List (filter/search)   |
| GET    | /api/properties/:id         | Get single             |
| POST   | /api/properties             | Create (host)          |
| PUT    | /api/properties/:id         | Update (host)          |
| DELETE | /api/properties/:id         | Delete (host)          |
| GET    | /api/properties/my-listings | Host's listings        |

### Bookings
| Method | Endpoint                              | Description         |
|--------|--------------------------------------|---------------------|
| POST   | /api/bookings                        | Create booking      |
| GET    | /api/bookings/my                     | My bookings         |
| GET    | /api/bookings/host                   | Host's bookings     |
| PUT    | /api/bookings/:id/cancel             | Cancel booking      |
| GET    | /api/bookings/property/:id/dates     | Booked dates        |

### Reviews
| Method | Endpoint                | Description       |
|--------|------------------------|--------------------|
| POST   | /api/reviews            | Create review      |
| GET    | /api/reviews/:propertyId| Property reviews   |

### Wishlist
| Method | Endpoint             | Description    |
|--------|---------------------|----------------|
| POST   | /api/wishlist/add    | Add to list    |
| POST   | /api/wishlist/remove | Remove         |
| GET    | /api/wishlist/my     | Get wishlist   |

---

## ✨ Features

- ✅ Full JWT authentication (access + refresh tokens)
- ✅ Role-based access (user / host / admin)
- ✅ Property CRUD with image support
- ✅ Advanced search & filtering (location, price, guests, bedrooms, rating)
- ✅ Booking system with date overlap prevention
- ✅ Review system with auto-calculated ratings
- ✅ Wishlist functionality
- ✅ Host dashboard with stats
- ✅ Responsive UI (mobile + desktop)
- ✅ Toast notifications
- ✅ Loading states & transitions
- ✅ Seed script with demo data

---
