const xss = require("xss");

const UsersService = {
  getAllUsers(db) {
    return db
      .from("squared_squirrel_users AS user")
      .select("id", "username", "date_created");
  },

  getById(db, requestedId) {
    return UsersService.getAllUsers(db)
      .where({ id: requestedId })
      .first();
  },

  getByUsername(db, requestedUsername) {
    return UsersService.getAllUsers(db)
      .where({ username: requestedUsername })
      .first();
  },

  getUserStatistics(db, requestedUsername) {
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

  // Function needs to change up to three values. lowestTimeWin can change to any integer value, but game_played and games_won should only ever increment the current value. I separated it out into three updates just so I can check whether the value needs to be updated.
  updateUserStatistics(db, userToUpdate) {
    const lowestTimeWin = userToUpdate.lowestTimeWin;
    return UsersService.getById(db, userToUpdate.id)
      .then(user => {
        return db
          .from("squared_squirrel_users_statistics")
          .where({ user_id: user.id })
          .update({ lowest_time_win: lowestTimeWin })
          .returning("*")
          .then(([user]) => user);
      })
      .then(user => {
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
