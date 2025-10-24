const Post = require("../../models/post");
const CustomError = require("../../utils/customError");

module.exports = async (req, res) => {
  const { userId } = req.user;

  const posts = await Post.find({ user: userId }).populate(
    "user",
    "-password -__v -createdAt -updatedAt -role -_id"
  );

  if (!posts) throw new CustomError(404, "Post not found");

  res.status(200).json({
    status: "success",
    message: "Post fetched successfully",
    data: posts,
  });
};
