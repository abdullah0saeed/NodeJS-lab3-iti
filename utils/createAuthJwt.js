const jwt = require("jsonwebtoken");
const CustomError = require("./customError");
const { promisify } = require("util");

const jwtSign = promisify(jwt.sign);

module.exports = async (user) => {
  if (!process.env.JWT_SECRET_KEY)
    throw new CustomError(
      500,
      "JWT_SECRET is not defined in environment variables"
    );
  if (!process.env.JWT_EXPIRES_IN)
    throw new CustomError(
      500,
      "JWT_EXPIRES_IN is not defined in environment variables"
    );
  const secretKey = process.env.JWT_SECRET_KEY;
  const expiresIn = process.env.JWT_EXPIRES_IN;
  const payload = { id: user._id, email: user.email, role: user.role };
  const token = await jwtSign(payload, secretKey, {
    expiresIn: expiresIn,
  });

  return token;
};
