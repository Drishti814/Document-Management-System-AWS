📂 Smart Document Management System

A secure and responsive document management portal that allows users to upload, download, and manage files using AWS S3 cloud storage.

🚀 Features

📤 Upload files directly to AWS S3

📥 Download stored files securely

🗑️ Delete files from S3 bucket

🔒 Encrypted storage using AWS S3 default encryption

💻 Responsive frontend built with React

🎨 Styled with CSS for a clean UI

🛠️ Tech Stack

Frontend: React (JavaScript, CSS)

Cloud Storage: AWS S3

AWS SDK: For file upload/download operations

UI Enhancements: Custom CSS & styled buttons

⚙️ Setup Instructions
1️⃣ Clone the Repository
git clone https://github.com/your-username/document-management-system.git
cd document-management-system

2️⃣ Install Dependencies
npm install

3️⃣ Configure AWS

Create an AWS S3 bucket

Enable CORS policy for file upload/download

Get your AWS Access Key ID and Secret Access Key

Add them in an .env file in the project root:

REACT_APP_AWS_ACCESS_KEY_ID=your_access_key
REACT_APP_AWS_SECRET_ACCESS_KEY=your_secret_key
REACT_APP_AWS_REGION=your-region
REACT_APP_AWS_BUCKET_NAME=your-bucket-name

4️⃣ Run the Application
npm start


Open http://localhost:3000
 to view it in the browser.


📌 Future Improvements

✅ Add authentication (Cognito / Firebase / JWT) for secure access

✅ Add file preview (PDF/Image) before download

✅ Add role-based access control (Admin/User)
