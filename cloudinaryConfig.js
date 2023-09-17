// cloudinaryConfig.js
import { v2 as cloudinary } from 'cloudinary';
const apiKey = import.meta.env.VITE_CLOUDFARE_API_KEY;
const secret = import.meta.env.VITE_CLOUDFARE_SECRET_KEY;
const cloudName = import.meta.env.VITE_CLOUDFARE_NAME;

cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: secret,
});

export default cloudinary;
