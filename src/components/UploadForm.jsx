// src/components/UploadForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography } from '@mui/material';

const UploadForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      const response = await axios.post('http://localhost:3000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadResult(response.data); // On s'attend à recevoir { url: '/uploads/xxx.jpg' }
    } catch (error) {
      console.error('Erreur lors de l\'upload', error);
    }
  };

  return (
    <Box sx={{ mt: 4, textAlign: 'center' }}>
      <Typography variant="h6">Uploader une image</Typography>
      <TextField type="file" onChange={handleFileChange} />
      <Button variant="contained" color="primary" onClick={handleUpload} sx={{ ml: 2 }}>
        Upload
      </Button>
      {uploadResult && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          Image disponible à l'URL: {uploadResult.url}
        </Typography>
      )}
    </Box>
  );
};

export default UploadForm;
