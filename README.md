# 📸 GalleryPro – Full Stack Image Gallery Application

## 🚀 Overview

GalleryPro is a full-stack image gallery application that allows users to upload, manage, and explore images with authentication and cloud storage integration. It is designed with a scalable architecture and modern UI, making it suitable for real-world applications.

---

## ✨ Features

* 🔐 **User Authentication (JWT-based)**
* 📤 **Image Upload & Delete**
* ☁️ **Cloud Storage Integration (Cloudinary)**
* 🌍 **Public & Private Image Visibility**
* 🔍 **Image Filtering & Search**
* 📄 **Pagination for Large Datasets**
* ❤️ **User-specific Image Management**
* ⚡ **Fast API with Clean Architecture**
* 🎨 **Modern Responsive UI (React)**

---

## 🏗️ Tech Stack

### Frontend

* React (Vite)
* Context API
* Axios
* CSS / Tailwind / Bootstrap

### Backend

* Node.js
* Express.js

### Database

* MongoDB (Mongoose)

### Cloud Services

* Cloudinary (Image Storage)

### Authentication

* JWT (JSON Web Tokens)

---

## 📂 Project Structure

```
GalleryPro/
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── context/
│   └── services/
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── models/
│   └── middleware/
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```
git clone https://github.com/your-username/gallerypro.git
cd gallerypro
```

### 2️⃣ Backend Setup

```
cd backend
npm install
```

Create `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

Run backend:

```
npm start
```

---

### 3️⃣ Frontend Setup

```
cd frontend
npm install
npm run dev
```

---

## 🔐 Environment Variables

Make sure to create a `.env` file in the backend with:

* MongoDB connection string
* JWT secret
* Cloudinary credentials

---

## 📸 Key Functionalities

* Users can upload images which are stored in Cloudinary
* Metadata is stored in MongoDB
* JWT authentication secures routes
* Users can view public images and manage their own private images

---

## 🧠 Learning Outcomes

* Full-stack development with MERN stack
* REST API design and implementation
* JWT authentication and security
* Cloud integration (Cloudinary)
* Clean architecture (MVC pattern)
* State management using Context API

---

## 🚀 Future Improvements

* 🔍 Advanced search (AI-based tagging)
* 📱 Mobile app version
* 🧠 Image recommendation system
* 💬 Comments & likes system

---

## 👨‍💻 Author

**Ajit Paraskar**

* Passionate Full Stack Developer
* Skilled in MERN Stack, Python, and AI-based applications

---

## 🌟 Conclusion

GalleryPro demonstrates a complete full-stack workflow including frontend, backend, database, authentication, and cloud integration. It reflects real-world project development practices and scalable system design.

---
