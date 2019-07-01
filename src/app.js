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

// get all users
app.get("/api/users", (req, res, next) => {
  UsersService.getAllUsers(req.app.get("db"))
    .then(users => {
      console.log(users);
      res.json(users.map(UsersService.serializeUser));
    })
    .catch(next);
});

// get single user
app.get("/api/users/single", (req, res, next) => {
  const requestedUser = req.query.username;
  console.log("requestedUser", requestedUser);
  UsersService.getByUsername(req.app.get("db"), requestedUser)
    .then(user => {
      console.log("user", user);
      res.json(UsersService.serializeUser(user));
    })
    .catch(next);
});

// get single user statistics
app.get("/api/users/single/statistics", (req, res, next) => {
  const requestedUser = req.query.username;
  UsersService.getUserStatistics(req.app.get("db"), requestedUser)
    .then(user => {
      console.log("user", user);
      res.json(user);
    })
    .catch(next);
});

// update user statistics
app.patch("/api/users/single", jsonBodyParser, (req, res, next) => {
  let userToUpdate = req.body.userStatistics;
  if (userToUpdate == null) {
    return res.status(400).json({ error: `Missing username in body` });
  }

  console.log("userToUpdate", userToUpdate);
  UsersService.updateUserStatistics(req.app.get("db"), userToUpdate)
    .then(user => {
      console.log("user after UpdateUser() call", user);
      res.status(201).json(user);
    })

    .catch(next);
});

// register new user
app.post("/api/users", jsonBodyParser, (req, res, next) => {
  let newUser = req.body.username;
  console.log("username", newUser);
  if (newUser == null) {
    return res.status(400).json({ error: `Missing username in body` });
  }

  newUser = { username: `${newUser}` };

  // checks whether the username already exists and returns the entry if it does
  UsersService.getAllUsers(req.app.get("db"))
    .then(users => {
      let userAlreadyExists = false;
      users.map(user => {
        if (newUser.username === user.username) {
          console.log("we have a match");
          userAlreadyExists = true;
        }
      });
      return userAlreadyExists;
    })
    .then(userAlreadyExists => {
      console.log("userAlreadyExists", userAlreadyExists);
      if (!userAlreadyExists) {
        console.log("is this code running");
        UsersService.insertUser(req.app.get("db"), newUser).then(user => {
          res.status(201).json(UsersService.serializeUser(user));
        });
      } else {
        // if user already exists, just return the requested user then
        UsersService.getByUsername(req.app.get("db"), newUser.username).then(
          user => {
            console.log("user", user);
            res.status(200).json({
              userInfo: UsersService.serializeUser(user)
            });
          }
        );
      }
    })

    .catch(next);
});

// delete user
app.delete("/api/users", jsonBodyParser, (req, res, next) => {
  let userToDelete = req.body.username;
  console.log("username", userToDelete);
  if (userToDelete == null) {
    return res.status(400).json({ error: `Missing username in body` });
  }

  UsersService.deleteUser(req.app.get("db"), userToDelete)
    .then(user => {
      console.log("deleted user:", userToDelete);
      res.status(200).json({ message: `${userToDelete} was deleted.` });
    })
    .catch(next);
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
