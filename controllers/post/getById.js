const Post = require("../../models/post");
const CustomError = require("../../utils/customError");

module.exports = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  const post = await Post.findById(id, {
    title: 1,
    content: 1,
    user: 1,
    createdAt: 1,
  }).populate("user", "-password -__v -createdAt -updatedAt -role");

  if (post.user._id.toString() !== userId.toString())
    throw new CustomError(401, "Unauthorized");

  if (!post) throw new CustomError(404, "Post not found");

  res.status(200).json({
    status: "success",
    message: "Post fetched successfully",
    data: post,
  });
};
