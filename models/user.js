const mongoose = require("mongoose");
const z = require("zod");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: () => `email is not valid!`,
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

const validateUser = (user) => {
  const schema = z.object({
    name: z.string().min(3, {
      message: "Name is required and must be at least 3 characters long",
    }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
    role: z.enum(["user", "admin"]).optional(),
  });

  const result = schema.safeParse(user);
  if (!result.success) {
    const errorMessages = result.error.issues
      ?.map((err) => err.message)
      .join(", ");
    return { error: new Error(errorMessages) };
  }
  return { error: null };
};

module.exports = { User, validateUser };
