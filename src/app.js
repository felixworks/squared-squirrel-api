require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const { CLIENT_ORIGIN } = require("./config");
const jsonBodyParser = express.json();
const UsersService = require("./users-service.js");

const app = express();

const morganOption = process.env.NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganOption));
app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);
app.use(helmet());

app.get("/api/users", (req, res, next) => {
  UsersService.getAllUsers(req.app.get("db"))
    .then(users => {
      console.log(users);
      res.json(users.map(UsersService.serializeUser));
    })
    .catch(next);
});

app.get("/api/users/selected", (req, res) => {
  console.log("req.query", req.query);
  UsersService.getById(req.app.get("db"), req.query.user_id).then(user => {
    console.log("user", user);
    res.json(UsersService.serializeUser(user));
  });
});

app.post("/api/users", jsonBodyParser, (req, res, next) => {
  let newUser = req.body.username;
  console.log("username", newUser);
  if (newUser == null) {
    return res.status(400).json({ error: `Missing username in body` });
  }

  newUser = { username: `${newUser}` };

  UsersService.insertUser(req.app.get("db"), newUser)
    .then(user => {
      res.status(201).json(UsersService.serializeUser(user));
    })
    .catch(next);
});

app.delete("/api/users", jsonBodyParser, (req, res) => {
  let userToDelete = req.body.username;
  console.log("username", userToDelete);
  if (userToDelete == null) {
    return res.status(400).json({ error: `Missing username in body` });
  }

  UsersService.deleteUser(req.app.get("db"), userToDelete).then(user => {
    console.log("deleted user:", userToDelete);
    res.status(200).json({ message: `${userToDelete} was deleted.` });
  });
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
