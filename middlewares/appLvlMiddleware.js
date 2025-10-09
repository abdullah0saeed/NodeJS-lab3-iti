const express = require("express");
const cors = require("cors");
const { rateLimit } = require("express-rate-limit");
const helmet = require("helmet");
const hpp = require("hpp");
const { xss } = require("express-xss-sanitizer");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    status: "error",
    message: "Too many requests from this IP, please try again later.",
  },
});

module.exports = (app) => {
  app.use(limiter);
  app.use(helmet());
  app.use(hpp());
  app.use(xss());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};
