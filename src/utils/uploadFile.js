const cloudinary = require("./cloudinary");

async function uploadFileToCloudinary(fileBuffer, folder) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto", 
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    ).end(fileBuffer);
  });
}

async function deleteFileFromCloudinary(url) {
  try {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
    const publicId = match ? match[1] : null;

    if (!publicId) return false;

    return new Promise((resolve) => {
      cloudinary.uploader.destroy(
        publicId,
        { resource_type: "auto" },
        (err, result) => {
          if (err || result?.result !== "ok") return resolve(false);
          resolve(true);
        }
      );
    });
  } catch (err) {
    console.error("Delete error:", err);
    return false;
  }
}

module.exports = {
  uploadFileToCloudinary,
  deleteFileFromCloudinary,
};
