const User = require("../../models/User");

module.exports = async (req, res) => {
  const { page = 1, limit = 10, search } = req.query;
  const skip = page && limit ? (page - 1) * limit : 0;

  const users = await User.find({
    $or: [
      { name: { $regex: search || "", $options: "i" } },
      { email: { $regex: search || "", $options: "i" } },
    ],
  })
    .select("-password")
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const totalUsers = await User.countDocuments();

  res.status(200).json({
    status: "success",
    message: "Users fetched successfully",
    data: users,
    page: parseInt(page),
    limit: parseInt(limit),
    totalUsers,
    totalPages: Math.ceil(totalUsers / limit),
  });
};
