const CustomError = require("../utils/customError");

module.exports = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) throw new CustomError(403, "Forbidden");
  next();
};
