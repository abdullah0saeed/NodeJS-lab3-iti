const User = require("../../models/User");
const bcrypt = require("bcrypt");
const CustomError = require("../../utils/customError");

module.exports = async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (user) throw new CustomError(400, "User with this email already exists");

  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  req.body.password = hashedPassword;

  user = new User(req.body);
  user = await user.save();

  user = { ...user.toObject() };
  delete user.password;

  res.status(201).json({
    status: "success",
    message: "User created successfully",
    data: user,
  });
};
