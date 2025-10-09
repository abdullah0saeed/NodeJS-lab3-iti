const router = require("express").Router();
const {
  signup,
  login,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/user");
const {
  validateCreateUser,
  validateLoginUser,
  validateUpdateUser,
} = require("../utils/validators/userValidator");

const auth = require("../middlewares/auth");
const restrictTo = require("../middlewares/restrictTo");

router.get("/:id", auth, getUserById);
router.put("/:id", auth, validateUpdateUser, updateUser);
router.delete("/:id", auth, deleteUser);
router.post("/signup", validateCreateUser, signup);
router.post("/login", validateLoginUser, login);
router.get("/", auth, restrictTo("admin"), getUsers);

module.exports = router;
