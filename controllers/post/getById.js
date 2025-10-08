const Post = require("../../models/post");
const CustomError = require("../../utils/customError");

module.exports = async (req, res) => {
  const { id } = req.params;

  const post = await Post.findById(id).populate(
    "user",
    "-password -__v -createdAt -updatedAt"
  );
  if (!post) throw new CustomError(404, "Post not found");

  res.status(200).json({
    status: "success",
    message: "Post fetched successfully",
    data: post,
  });
};
