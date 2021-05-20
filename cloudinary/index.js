const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.COULDINARY_CLOUD_NAME,
    api_key: process.env.COULDINARY_KEY,
    api_secret: process.env.COULDINARY_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'Gymlocator',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }

});

module.exports = {
    cloudinary,
    storage
}