# 🐾 Pet Adoption Portal

A web-based **Pet Adoption Portal** designed to connect potential adopters with pets in need of a loving home. The platform allows users to browse available pets, view detailed profiles, and manage adoption-related actions through a clean, user-friendly interface.

---

## ✨ Features

* 🐶 View a list of pets available for adoption
* 🐱 Detailed pet profiles (species, age, breed, description, status)
* 🔍 Filter pets by type or other attributes
* 👤 User and Admin roles (role-based access control)
* 🛠️ Admin functionality to manage pets and users
* 🔐 Secure authentication and protected routes

---

## 🧱 Tech Stack

**Frontend**

* TypeScript
* React / SvelteKit *(depending on implementation)*
* HTML & CSS

**Backend**

* Node.js
* REST APIs

**Database**

* SQL-based database (via Prisma ORM)

**Other Tools**

* JWT Authentication
* Git & GitHub

---

## 📁 Project Structure (Simplified)

```
PETS/
├── .idea/                     # IDE configuration files
├── src/
│   ├── lib/
│   │   ├── controllers/
│   │   │   └── PetActions.ts   # Business logic for pet-related actions
│   │   │
│   │   ├── models/
│   │   │   ├── Admin.ts        # Admin model
│   │   │   ├── Person.ts       # Base class (OOP)
│   │   │   ├── Pet.ts          # Pet model
│   │   │   └── User.ts         # User model
│   │   │
│   │   ├── services/
│   │   │   ├── Log.ts          # Log entity / logic
│   │   │   └── Logger.ts       # Logging service
│   │   │
│   │   ├── helpers.ts          # Shared utility/helper functions
│   │   ├── stores.ts           # Svelte stores (state management)
│   │   └── types.ts            # Shared TypeScript types/interfaces
│   │
│   ├── routes/
│   │   ├── (frontend)/         # Frontend routes (UI pages)
│   │   │   ├── admin/
│   │   │   ├── dashboard/
│   │   │   ├── login/
│   │   │   ├── logs/
│   │   │   ├── register/
│   │   │   └── shop/
│   │   │
│   │   ├── api/                # Backend API routes
│   │   │   ├── actions/        # Generic action handlers
│   │   │   ├── admin/          # Admin-specific endpoints
│   │   │   ├── adopt/          # Pet adoption endpoints
│   │   │   ├── auth/           # Authentication (login/register)
│   │   │   ├── inventory/      # Pet inventory management
│   │   │   ├── log/            # Logging endpoints
│   │   │   ├── pets/           # Pet-related APIs
│   │   │   ├── shop/           # Shop-related APIs
│   │   │   └── updatedInventory/
│   │   │
│   │   ├── +layout.svelte      # Root layout
│   │   └── +page.svelte        # Home page
│   │
│   ├── app.d.ts                # Global TypeScript declarations
│   └── app.html                # HTML entry point
│
└── static/                     # Static assets (images, icons, etc.)


---

## 🚀 Getting Started

### Prerequisites

* Node.js
* npm or yarn
* Git

### Installation

```bash
git clone https://github.com/your-username/pet-adoption-portal.git
cd pet-adoption-portal
npm install
```

### Run the project

```bash
npm run dev
```

The app will be available at `http://localhost:3000` (or the configured port).

---

## 🧠 Learning Outcomes

This project was built to:

* Practice **object-oriented programming** principles
* Implement **role-based access control**
* Strengthen frontend–backend integration
* Improve code modularity and project structure
* Gain hands-on experience with full-stack development

---

## 🔮 Future Improvements

* Adoption request & approval workflow
* Image uploads for pets
* Favorites / wishlist feature
* Deployment with Docker
* Improved UI/UX and accessibility

---

## 👩‍💻 Author

**Vasundhara (Vasu)**
Computer Science & Engineering student passionate about building meaningful and user-focused applications.

---

## 📜 License

This project is for educational purposes.



