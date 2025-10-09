const router = require("express").Router();

const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} = require("../controllers/post");

const {
  validateCreatePost,
  validateUpdatePost,
} = require("../utils/validators/postValidator");

const restrictTo = require("../middlewares/restrictTo");

router.get("/:id", getPostById);
router.put("/:id", validateUpdatePost, updatePost);
router.delete("/:id", restrictTo("admin"), deletePost);
router.post("/", validateCreatePost, createPost);
router.get("/", getPosts);

module.exports = router;
