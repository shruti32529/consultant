# Consultation  Manager

A full-stack web application to manage client consultations, securely store consultation records, upload recordings, and maintain organized client information.

## Project Objective

This project was built as part of a software engineering challenge to demonstrate:

* Problem-solving approach
* Backend API development
* Authentication and authorization
* Database integration
* File upload handling
* Frontend and backend integration
* Engineering decisions under limited time constraints

---
Register Page
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/3d2074c9-bc34-4c91-9b1c-35c1bfad6ba7" />


Login Page
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/a31f26a4-cd81-45b4-a51e-cad74d4ac636" />

Dashboard
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/a72aaa6b-f2fe-41c7-8011-94c4464a0d98" />

Add Consulation
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/94b19358-5ba8-40d0-85c4-fcbc09878965" />

## Features

### Authentication

* User Registration
* User Login
* JWT-based Authentication
* Protected Routes

### Consultation Management

* Add Consultation
* View All Consultations
* Delete Consultation
* Search Consultations
* Consultation Notes

### File Upload

* Upload consultation recordings/files
* View uploaded recordings

### Dashboard

* Clean dashboard UI
* Search functionality
* Secure access after login

---

## Tech Stack

### Frontend

* HTML
* CSS
* JavaScript

### Backend

* Node.js
* Express.js

### Database

* MySQL
* Sequelize ORM

### Authentication

* JWT (JSON Web Token)
* bcryptjs

### File Upload

* Multer

---

## Project Structure

```txt
consultation-recording-manager/
│── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── public/
│   │   ├── css/
│   │   ├── js/
│   │   └── pages/
│   ├── routes/
│   ├── uploads/
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── README.md
├── AI_USAGE.md
└── NEW_FEATURES.md
```

---

## Installation & Setup

### 1. Clone Repository

```bash
git clone <repository-link>
cd consultation-recording-manager
```

### 2. Install Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside `backend/`:

```env
PORT=5000

MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=database

JWT_SECRET=pasword
```

### 4. Start Server

```bash
npm start
```

or

```bash
npm run dev
```

Server runs at:

```txt
http://localhost:5000
```

---

## Database Setup

Create MySQL database:

```sql
CREATE DATABASE bcde;
```

Tables are automatically generated using Sequelize.

---

## API Endpoints

### Authentication

#### Register User

```http
POST /api/auth/register
```

#### Login User

```http
POST /api/auth/login
```

---

### Consultations

#### Add Consultation

```http
POST /api/consultation/add
```

#### Get All Consultations

```http
GET /api/consultation/all
```

#### Delete Consultation

```http
DELETE /api/consultation/:id
```

---

## Assumptions

* Users must register before login.
* MySQL server is running locally.
* Uploaded files are stored locally.
* JWT authentication secures consultation routes.

---

## Future Improvements

* Edit consultation feature
* Audio recording playback
* Cloud file storage
* Admin panel
* Role-based authentication
* Better analytics dashboard
* Pagination and filters
* Deployment support

---

## Demo Flow

1. Register Account
2. Login
3. Add Consultation
4. Upload Recording
5. View Dashboard
6. Search Consultation
7. Delete Consultation

---

## Author

**Shruti**
B.Tech CSE Student

---

## GitHub Repository

Project source code available in this repository.
