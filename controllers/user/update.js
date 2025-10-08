const User = require("../../models/User");
const CustomError = require("../../utils/customError");

module.exports = async (req, res) => {
  // here User can update only name and email
  const { id } = req.params;
  let user = await User.findById(id).select("-password");
  if (!user) throw new CustomError(404, "User not found");

  // Check if email is being updated and if it already in use by another user
  if (req.body.email && req.body.email !== user.email) {
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists)
      throw new CustomError(400, "Email is already in use by another user");
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;

  await user.save();

  res.status(200).json({
    status: "success",
    message: "User updated successfully",
    data: user,
  });
};
