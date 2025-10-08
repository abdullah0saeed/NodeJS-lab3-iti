const z = require("zod");
const mongoose = require("mongoose");
const CustomError = require("../customError");

exports.validateCreatePost = (req, res, next) => {
  const schema = z.object({
    title: z.string().min(5, { message: "Title is required" }),
    content: z.string().min(10, { message: "Content is required" }),
    userId: z
      .string({ required_error: "User ID is required" })
      .refine((id) => mongoose.Types.ObjectId.isValid(id), {
        message: "Invalid User ID",
      }),
  });

  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errorMessages = result.error.issues
      ?.map((err) => err.message)
      .join(", ");

    throw new CustomError(400, errorMessages);
  }
  next();
};

// !--------------------------------------------------------------------------------------------------

exports.validateUpdatePost = (req, res, next) => {
  const schema = z.object({
    title: z.string().min(5).optional(),
    content: z.string().min(10).optional(),
  });

  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errorMessages = result.error.issues
      ?.map((err) => err.message)
      .join(", ");

    throw new CustomError(400, errorMessages);
  }
  next();
};
