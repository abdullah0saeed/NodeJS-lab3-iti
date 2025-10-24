const Post = require("../../models/post");
const CustomError = require("../../utils/customError");

module.exports = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  const post = await Post.findByIdAndDelete(id);
  if (!post) throw new CustomError(404, "Post not found");

  if (post.user.toString() !== userId.toString())
    throw new CustomError(401, "Unauthorized");

  res
    .status(200)
    .json({ status: "success", message: "Post deleted successfully" });
};
