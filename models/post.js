const mongoose = require("mongoose");
const z = require("zod");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Post = mongoose.model("Post", postSchema);

const validatePost = (post) => {
  const schema = z.object({
    title: z.string().min(5, { message: "Title is required" }),
    content: z.string().min(10, { message: "Content is required" }),
    userId: z
      .string({ required_error: "User ID is required" })
      .refine((id) => mongoose.Types.ObjectId.isValid(id), {
        message: "Invalid User ID",
      }),
  });

  const result = schema.safeParse(post);
  if (!result.success) {
    const errorMessages = result.error.issues
      ?.map((err) => err.message)
      .join(", ");
    console.log(errorMessages);

    return { error: new Error(errorMessages) };
  }
  return { error: null };
};

module.exports = { Post, validatePost };
