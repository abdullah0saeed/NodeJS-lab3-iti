const router = require("express").Router();

const {
  createPost,
  getPosts,
  getUserPosts,
  getPostById,
  updatePost,
  deletePost,
} = require("../controllers/post");

const {
  validateCreatePost,
  validateUpdatePost,
} = require("../utils/validators/postValidator");

const restrictTo = require("../middlewares/restrictTo");
const auth = require("../middlewares/auth");

router.get("/me", auth, getUserPosts);
router.get("/:id", auth, getPostById);
router.put("/:id", auth, validateUpdatePost, updatePost);
router.delete("/:id", auth, deletePost);
router.post("/", auth, validateCreatePost, createPost);
router.get("/", auth, restrictTo(["admin"]), getPosts);

module.exports = router;
