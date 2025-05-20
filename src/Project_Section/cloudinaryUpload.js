import { v2 as cloudinary } from 'cloudinary'


// ✅ Upload function
const uploadFile = async (uploadedFile) => {
    // ✅ Handle file path (local file)
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    try {

        const result = await cloudinary.uploader.upload(uploadedFile, {
            resource_type: "auto"
        })

        return {
            result: result
        }

    } catch (error) {
        console.error(`❌ Cloudinary Upload Error: ${error.message}`);
        throw new Error('Error while uploading to Cloudinary');
    }
};

export { uploadFile }