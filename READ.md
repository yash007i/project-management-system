# 🌩️ Cloud Cache

**Cloud Cache** is a full-stack Project Management and Cloud Storage application. It empowers teams to manage their projects, daily tasks, team collaboration, notes, and file storage—all in one place. Featuring a Kanban-style task board and Cloud-base file system, it's built for productivity and scalability.

---

## 🚀 Tech Stack

### 🖥️ Frontend
- **JavaScript**
- **React**
- **Zustand** – Lightweight state management
- **Zod** – Schema-based validation
- **Cloudinary** – File/media management

### 🛠️ Backend
- **Node.js**
- **Express.js**
- **MongoDB** with **Mongoose**
- **Express Validator** – Server-side validation
- **Nodemailer** – Email verification & notifications

---

## 📌 Core Features

### ✅ Project & Task Management
- Create and manage multiple projects
- Add, update, and delete project-related daily tasks
- Assign tasks to team members
- Write notes and attach files to each task
- Set task priority and due dates

### 📊 🧩 Kanban Board
- Drag & drop task cards across **To Do**, **In Progress**, and **Done** columns
- Real-time updates and persistent task states
- Visualize task progress per project
- Supports inline task edits and detail modals

### 👥 Team Collaboration
- Add or remove members from a project
- Assign roles: Admin, Manager, Contributor
- Role-based access for security and control

### ☁️ Cloud File Management (Google Drive-style)
- Upload files to projects or folders
- Organize files in folders/subfolders
- Star/Pin important files
- Recycle Bin: delete files with **30-day recovery period**

### 📧 User Verification & Security
- Secure registration and login
- Email verification using Nodemailer
- Cloudinary integration for secure media handling
- Backend & frontend validation (Zod + Express Validator)

---

## 🧱 Project Structure
cloud-cache/  
│  
├── frontend/ # React frontend (Zustand, Zod)  
├── backend/ # Node.js backend (Express, MongoDB)  
└── README.md 

---

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/cloud-cache.git
cd cloud-cache
```

### 2. Install Frontend Dependencies
```bash
cd frontend
npm install
```

### 3. Install Backend Dependencies
```bash
cd ../backend
npm install
```

### 4. Create Environment Files
Create .env in the backend/ folder with the following variables:  
MONGO_URI=your_mongo_connection_string  
ACCESS_TOKEN_SECRET=your_jwt_secret  
ACCESS_TOKEN_EXPIRY=your_jwt_expiry  
REFRESH_TOKEN_SECRET=your_jwt_secret  
REFRESH_TOKEN_EXPIRY=your_jwt_expiry  
CLOUDINARY_CLOUD_NAME=your_cloudinary_name  
CLOUDINARY_API_KEY=your_cloudinary_api_key  
CLOUDINARY_API_SECRET=your_cloudinary_api_secret  
NODEMAILER_HOST=smtp.yourprovider.com  
NODEMAILER_PORT=your_email@example.com  
NODEMAILER_USER=your_userid  
NODEMAILER_PASSWORD=your_email_password  


### 🔄 Run the Application
▶️ Start Backend
```bash
cd backend
npm run start
```

### ▶️ Start Frontend
```bash
cd frontend
npm run dev
```
