const User = require("../../models/User");
const CustomError = require("../../utils/customError");

module.exports = async (req, res) => {
  const { id } = req.params;

  const user = await User.findByIdAndDelete(id).select("-password");
  if (!user) throw new CustomError(404, "User not found");

  res.status(200).json({
    status: "success",
    message: "User deleted successfully",
    data: user,
  });
};
