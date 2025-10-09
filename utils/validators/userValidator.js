const z = require("zod");
const CustomError = require("../customError");

exports.validateCreateUser = (req, res, next) => {
  const schema = z.object({
    name: z.string({ required_error: "Name is required" }).min(3, {
      message: "Name is required and must be at least 3 characters long",
    }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
    role: z.enum(["user", "admin"]).optional(),
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

// ! --------------------------------------------------------------------------------------------

exports.validateLoginUser = (req, res, next) => {
  const schema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string(),
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

// ! --------------------------------------------------------------------------------------------

exports.validateUpdateUser = (req, res, next) => {
  const schema = z.object({
    name: z.string(),
    email: z.string().email(),
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
