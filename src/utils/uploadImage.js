const cloudinary = require("./cloudinary");

async function uploadImageToCloudinary(fileBuffer, folder) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );

    uploadStream.end(fileBuffer);
  });
}

module.exports = {
  uploadImageToCloudinary,
};

async function deleteImageFromCloudinary(url) {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
  const publicId = match ? match[1] : null;

  if (!publicId) return false;

  return new Promise((resolve) => {
    cloudinary.uploader.destroy(publicId, { resource_type: "image" }, (err, result) => {
      if (err || result.result !== "ok") return resolve(false);
      resolve(true);
    });
  });
}

module.exports = {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
};
