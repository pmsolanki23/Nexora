// import multer from 'multer';
// import crypto from 'crypto';
// import path from 'path';

// const storage = multer.diskStorage({
//   destination: 'uploads/',
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);

//     cb(
//       null,
//       `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`
//     );
//   }
// });

// const upload = multer({ storage });

// export default upload;

import multer from "multer";

import crypto from "crypto";

import path from "path";

const storage = multer.diskStorage({
  destination: "uploads/",

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    cb(null, `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter,
});

export default upload;
