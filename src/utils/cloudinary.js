import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        // If there is no file:
        if(!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto",
        })
        // in upload method, we take the first thing which is file url and the second thing is the object in which we can set so many options which you can read on cloudinary documentation. One thing which we have taken over ther is resource type, we can take image, file or video individually but we have taken auto so that any of the file type will be stored over there.
        // the file is successfully uploaded
        console.log("file is uploaded on cloudinary", response.url);
        return response;
    }
    catch(err) {
        fs.unlinkSync(localFilePath) // This is our strategy that if the file has come up in our local server and does not uploaded on cloudinray then rather we have lot more files in our local, these file will be removed.
        // remove the locally saved temporary files as the uploaded operations got failed.

    }
}

export { uploadOnCloudinary }