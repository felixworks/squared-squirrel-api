require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const { CLIENT_ORIGIN } = require("./config");
const jsonBodyParser = express.json();

const app = express();

const morganOption = process.env.NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganOption));
app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);
app.use(helmet());

app.get("/api/*", (req, res) => {
  res.json({ ok: true });
});

app.post("/api/auth/login", jsonBodyParser, (req, res) => {
  const username = req.body.username;
  console.log("username", username);
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
