require("dotenv").config();
const express = require("express");

const app = express();

require("./middlewares/appLvlMiddleware")(app);

// Routes
app.use("/users", require("./routes/user"));
app.use("/posts", require("./routes/post"));

// Error Handler
app.use(require("./middlewares/errorHandler"));

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on PORT: ${port}`);
  require("./config/connectDB")();
});
