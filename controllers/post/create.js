const Post = require("../../models/post");

module.exports = async (req, res) => {
  let post = {
    title: req.body.title,
    content: req.body.content,
    user: req.user.userId,
  };

  post = await Post.create(post);

  res.status(201).json({
    status: "success",
    message: "Post created successfully",
    data: post,
  });
};
