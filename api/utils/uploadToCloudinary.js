import cloudinary from './cloudinary.js';
import fs from 'fs';

const uploadToCloudinary = async (localFilePath) => {
  try {
    const result = await cloudinary.uploader.upload(localFilePath, {
      folder: 'real_estate_uploads',
    });
    // Optional: delete the file locally after upload
    fs.unlinkSync(localFilePath);
    return result.secure_url;
  } catch (error) {
    throw new Error('Cloudinary upload failed: ' + error.message);
  }
};

export default uploadToCloudinary;
