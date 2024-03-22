import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'



cloudinary.config({
    cloud_name: process.env.CLOUDINAY_CLOUD_NAME,
    api_key: process.env.CLOUDINAY_API_KEY,
    api_secret: process.env.CLOUDINAY_API_SECRET
});


const uploadFileOnCloudinay = async (localFilepath) => {
    try {
        if (!localFilepath) return null
        //Upload the file on cloud
        const response = await cloudinary.uploader.upload(localFilepath, {
            resource_type: "auto"
        })
        //File has been uploaded
        // console.log("Your File is uploaded!!", response.url);
        //after getting file autometically removing
        fs.unlinkSync(localFilepath)
        return response;
    } catch (error) {
        fs.unlinkSync(localFilepath)
        //remove the locally saved temporary file as the upload operation got failed
        return null
    }
}

export { uploadFileOnCloudinay }