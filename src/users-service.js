const xss = require("xss");

const UsersService = {
  getAllUsers(db) {
    return db
      .from("squared_squirrel_users AS user")
      .select("id", "username", "date_created");
  },

  getById(db, requestedId) {
    console.log("id", requestedId);
    return UsersService.getAllUsers(db)
      .where({ id: requestedId })
      .first();
  },

  getByUsername(db, requestedUsername) {
    console.log("username", requestedUsername);
    return UsersService.getAllUsers(db)
      .where({ username: requestedUsername })
      .first();
  },

  getUserStatistics(db, requestedUsername) {
    console.log("username (from statistics)", requestedUsername);
    return UsersService.getByUsername(db, requestedUsername).then(user => {
      return db
        .from("squared_squirrel_users_statistics")
        .where({ user_id: user.id })
        .select("id", "user_id", "games_played", "games_won", "lowest_time_win")
        .then(([user]) => user);
    });
  },

  serializeUser(user) {
    return {
      id: user.id,
      username: xss(user.username),
      date_created: user.date_created
    };
  },

  insertUserStatistics(db, user) {
    console.log(user);
    return db
      .insert({ user_id: user.id })
      .into("squared_squirrel_users_statistics")
      .returning("*")
      .then(([user]) => user);
  },

  insertUser(db, newUsername) {
    return db
      .insert(newUsername)
      .into("squared_squirrel_users")
      .returning("*")
      .then(([user]) => user)
      .then(user => UsersService.insertUserStatistics(db, user))
      .then(user => UsersService.getById(db, user.id));
  },

  updateUserInformation(db, userToUpdate) {
    const lowestTimeWin = userToUpdate.lowestTimeWin;
    return UsersService.getById(db, userToUpdate.id)
      .then(user => {
        console.log(user);
        return db
          .from("squared_squirrel_users_statistics")
          .where({ user_id: user.id })
          .update({ lowest_time_win: lowestTimeWin })
          .returning("*")
          .then(([user]) => user);
      })
      .then(user => {
        console.log("user inside second then", user);
        if (userToUpdate.incrementGamesPlayed) {
          return db
            .from("squared_squirrel_users_statistics")
            .where({ user_id: user.id })
            .increment("games_played")
            .returning("*")
            .then(([user]) => user);
        }
      })
      .then(user => {
        console.log("user inside second then", user);
        if (userToUpdate.incrementGamesWon) {
          return db
            .from("squared_squirrel_users_statistics")
            .where({ user_id: user.id })
            .increment("games_won")
            .returning("*")
            .then(([user]) => user);
        }
        return user;
      });
  },

  deleteUser(db, userToDelete) {
    return db
      .from("squared_squirrel_users")
      .where({ username: userToDelete })
      .del();
  }
};

module.exports = UsersService;
