const mongoose = require("mongoose");
const { User, validateUser } = require("../models/user");
const bcrypt = require("bcrypt");

exports.createUser = async (req, res) => {
  console.log(req.body);

  try {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).json({ message: error.message });

    let user = await User.findOne({ email: req.body.email });
    if (user)
      return res.status(400).json({ message: "User already registered" });

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;

    user = new User(req.body);
    user = await user.save();

    user = { ...user.toObject() };
    delete user.password;

    res.status(201).json({ message: "User created successfully", data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ! --------------------------------------------------------------------------------------------

exports.getUsers = async (req, res) => {
  const { page = 1, limit = 10, search } = req.query;
  const skip = page && limit ? (page - 1) * limit : 0;
  try {
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
      message: "Users fetched successfully",
      data: users,
      page: parseInt(page),
      limit: parseInt(limit),
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ! --------------------------------------------------------------------------------------------

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User fetched successfully", data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ! --------------------------------------------------------------------------------------------

exports.updateUser = async (req, res) => {
  // here User can update only name and email
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    let user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if email is being updated and if it already in use by another user
    if (req.body.email && req.body.email !== user.email) {
      const emailExists = await User.findOne({ email: req.body.email });
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    await user.save();

    res.status(200).json({ message: "User updated successfully", data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ! --------------------------------------------------------------------------------------------

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid user ID" });

    const user = await User.findByIdAndDelete(id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully", data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
