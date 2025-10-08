const Post = require("../../models/post");

module.exports = async (req, res) => {
  const { userId, page = 1, limit = 10, search } = req.query;
  const skip = page && limit ? (page - 1) * limit : 0;

  const posts = await Post.find({
    $or: [
      { title: { $regex: search || "", $options: "i" } },
      { content: { $regex: search || "", $options: "i" } },
    ],
    user: userId ? userId : { $exists: true },
  })
    .populate("user", "-password -__v -createdAt -updatedAt")
    .skip(parseInt(skip))
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const totalPosts = await Post.countDocuments({
    user: userId ? userId : { $exists: true },
  });

  res.status(200).json({
    status: "success",
    message: "Posts fetched successfully",
    data: posts,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(totalPosts / limit),
    totalPosts,
  });
};
