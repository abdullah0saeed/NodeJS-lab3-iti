const Post = require("../../models/post");

module.exports = async (req, res) => {
  let post = new post({
    title: req.body.title,
    content: req.body.content,
    user: req.body.userId,
  });

  post = await Post.save();
  res.status(201).json({
    status: "success",
    message: "Post created successfully",
    data: post,
  });
};
