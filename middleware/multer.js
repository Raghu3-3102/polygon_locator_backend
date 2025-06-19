// backend/middlewares/upload.js
import multer from "multer";
import path  from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    cb(null, baseName + "-" + Date.now() + ext);
  },
});

const fileFilter = function (req, file, cb) {
  if (file.mimetype === "application/vnd.google-earth.kml+xml" || file.originalname.endsWith(".kml")) {
    cb(null, true);
  } else {
    cb(new Error("Only .kml files are allowed!"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

export default upload;
