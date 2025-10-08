const router = require("express").Router();
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/user");
const {
  validateCreateUser,
  validateUpdateUser,
} = require("../utils/validators/userValidator");

router.get("/:id", getUserById);
router.put("/:id", validateUpdateUser, updateUser);
router.delete("/:id", deleteUser);
router.post("/", validateCreateUser, createUser);
router.get("/", getUsers);

module.exports = router;
