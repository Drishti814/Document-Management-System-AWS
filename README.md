# 📂 Smart Document Management System

A secure and user-friendly web app to upload, download, and manage files with **AWS S3 integration**.

---

## 🚀 Features
- 📤 Upload multiple files to AWS S3  
- 📥 Download files securely  
- 🗑️ Delete files with confirmation  
- 🔒 AWS S3 bucket integration for secure storage  
- 💻 Responsive React frontend  

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Drishti814/document-management-system.git
cd document-management-system
```
### 2️⃣ Install Dependencies
```bash
npm install
```
### 3️⃣ Configure AWS

- Create an AWS S3 bucket
- Enable CORS policy for file upload/download
- Get your AWS Access Key ID and Secret Access Key
- Add them in an .env file in the project root:
```bash
REACT_APP_AWS_ACCESS_KEY_ID=your_access_key
REACT_APP_AWS_SECRET_ACCESS_KEY=your_secret_key
REACT_APP_AWS_REGION=your-region
REACT_APP_AWS_BUCKET_NAME=your-bucket-name
```
### 4️⃣ Run the Application
```bash
npm start
```

👉 Open http://localhost:3000
 in your browser

 ---

 ## 🛠️ Tech Stack
- ⚛️ React.js  
- 🎨 Material-UI  
- ☁️ AWS S3 (for cloud storage)  

---

## 📌 Future Enhancements
- ✅ User authentication (Cognito / JWT)  
- ✅ File versioning  
- ✅ Role-based access (Admin / User)  
