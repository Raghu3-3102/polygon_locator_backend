// backend/middlewares/upload.js
import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = function (req, file, cb) {
  if (
    file.mimetype === "application/vnd.google-earth.kml+xml" ||
    file.originalname.endsWith(".kml")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only .kml files are allowed!"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB max
  },
});

export default upload;
