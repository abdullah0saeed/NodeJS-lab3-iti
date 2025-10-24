const User = require("../../models/User");
const bcrypt = require("bcrypt");
const CustomError = require("../../utils/customError");
const createAuthJwt = require("../../utils/createAuthJwt");

module.exports = async (req, res) => {
  const { name, email, password } = req.body;

  email = email.toLowerCase();

  let user = await User.findOne({ email });
  if (user) throw new CustomError(400, "User with this email already exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  req.body.password = hashedPassword;

  user = new User({ name, email, password: hashedPassword });
  user = await user.save();

  user = { ...user.toObject() };
  delete user.password;

  const token = await createAuthJwt(user);
  user.token = token;

  res.status(201).json({
    status: "success",
    message: "User created successfully",
    data: user,
  });
};
