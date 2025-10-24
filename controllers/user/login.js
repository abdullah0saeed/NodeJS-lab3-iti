const User = require("../../models/User");
const bcrypt = require("bcrypt");
const createAuthJwt = require("../../utils/createAuthJwt");
const CustomError = require("../../utils/customError");

module.exports = async (req, res) => {
  const { email, password } = req.body;
  // email = email.toLowerCase();

  let user = await User.findOne({ email });
  if (!user) throw new CustomError(400, "Invalid credentials");

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) throw new CustomError(400, "Invalid credentials");

  user = { ...user.toObject() };
  delete user.password;

  const token = await createAuthJwt(user);
  user.token = token;

  res.status(200).json({
    status: "success",
    message: "User logged in successfully",
    data: user,
  });
};
