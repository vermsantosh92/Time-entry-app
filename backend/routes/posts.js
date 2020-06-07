const express = require("express");
const multer = require("multer");

const postController = require('../controllers/post')
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

router.post(
  "",
  checkAuth,
  multer({ storage: storage }).single("image"),
   postController.createPost
);

router.put(
  "/:id",
  checkAuth,
  multer({ storage: storage }).single("image"),
   postController.postUpdateWithId
);

router.get("",postController.getPost );

// router.get("/:id",postController.getPostWithId );

// router.delete("/:id", checkAuth,  postController.deletePost);

module.exports = router;
