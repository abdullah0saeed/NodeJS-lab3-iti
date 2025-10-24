const Post = require("../../models/post");
const CustomError = require("../../utils/customError");

module.exports = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  let post = await Post.findById(id);
  if (!post) throw new CustomError(404, "Post not found");

  if (post.user.toString() !== userId.toString())
    throw new CustomError(401, "Unauthorized");

  post.title = req.body.title || post.title;
  post.content = req.body.content || post.content;

  post = await post.save();
  res.status(200).json({
    status: "success",
    message: "Post updated successfully",
    data: post,
  });
};
