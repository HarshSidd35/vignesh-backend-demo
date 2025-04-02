const express = require("express");
const router = express.Router();
const bookController = require("../controller/bookController");
const multer = require("multer");
const {isUser} = require("../middleware/isUser"); // Middleware for authentication
const {isAdmin} = require("../middleware/isAdmin"); // Middleware for admin access

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage: storage });

// Routes for book operations
router.post("/", isUser, isAdmin, upload.single("cover"), bookController.createBook);
router.get("/", isUser, bookController.getAllBooks);
router.get("/:id", isUser, bookController.getBookById);
router.put("/:id", isUser, isAdmin, upload.single("cover"), bookController.updateBook);
router.delete("/:id", isUser, isAdmin, bookController.deleteBook);

// Routes for managing last users and stock
router.post("/:id/addLastUser", isUser, bookController.addLastUser);
router.post("/:id/return", isUser, bookController.returnBook);

module.exports = router;
