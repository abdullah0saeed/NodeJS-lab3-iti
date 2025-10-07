const { default: mongoose } = require("mongoose");
const { Post, validatePost } = require("../models/post");

exports.createPost = async (req, res) => {
  try {
    const { error } = validatePost(req.body);
    if (error) return res.status(400).json({ message: error.message });

    let post = new Post({
      title: req.body.title,
      content: req.body.content,
      userId: req.body.userId,
    });

    post = await post.save();
    res.status(201).json({ message: "Post created successfully", data: post });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// !--------------------------------------------------------------------------------------------------

exports.getPosts = async (req, res) => {
  const { userId, page = 1, limit = 10, search } = req.query;
  const skip = page && limit ? (page - 1) * limit : 0;
  try {
    if (userId && !mongoose.Types.ObjectId.isValid(userId))
      return res.status(400).json({ message: "Invalid User ID" });

    const posts = await Post.find({
      $or: [
        { title: { $regex: search || "", $options: "i" } },
        { content: { $regex: search || "", $options: "i" } },
      ],
      userId: userId ? userId : { $exists: true },
    })
      .select("-userId")
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const totalPosts = await Post.countDocuments({
      userId: userId ? userId : { $exists: true },
    });

    res.status(200).json({
      message: "Posts fetched successfully",
      data: posts,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// !--------------------------------------------------------------------------------------------------

exports.getPostById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid Post ID" });

    const post = await Post.findById(id).select("-userId");
    if (!post) return res.status(404).json({ message: "Post not found" });

    res.status(200).json({ message: "Post fetched successfully", data: post });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// !--------------------------------------------------------------------------------------------------

exports.updatePost = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid Post ID" });

    let post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;

    post = await post.save();
    res.status(200).json({ message: "Post updated successfully", data: post });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// !--------------------------------------------------------------------------------------------------

exports.deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid Post ID" });

    const post = await Post.findByIdAndDelete(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
