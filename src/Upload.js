import React, { useState } from 'react';
import S3 from 'react-aws-s3';

window.Buffer = window.Buffer || require("buffer").Buffer;

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const config = {
    bucketName: "my-dms-bucket-new",
    region: "us-east-1",
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  }

  const handleFileInput = (e) => {
    setSelectedFile(e.target.files[0]);
  }

  const uploadFile = () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    console.log("Uploading file:", selectedFile.name);

    const ReactS3Client = new S3(config);
    ReactS3Client.uploadFile(selectedFile)
      .then(data => {
        console.log("Upload success:", data);
        alert("File uploaded at: " + data.location);
      })
      .catch(err => {
        console.error("Upload error:", err);
        alert("Upload failed. Check console for details.");
      });
  }

  return (
    <div>
      <h2>React S3 File Upload</h2>
      <input type="file" onChange={handleFileInput} />
      <br /><br />
      <button onClick={uploadFile}>Upload to S3</button>
    </div>
  );
}

export default Upload;
