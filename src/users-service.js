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

  serializeUser(user) {
    return {
      id: user.id,
      username: xss(user.username),
      date_created: user.date_created
    };
  },

  insertUser(db, newUsername) {
    return db
      .insert(newUsername)
      .into("squared_squirrel_users")
      .returning("*")
      .then(([user]) => user)
      .then(user => UsersService.getById(db, user.id));
  },

  deleteUser(db, userToDelete) {
    return db
      .from("squared_squirrel_users")
      .where({ username: userToDelete })
      .del();
  }
};

module.exports = UsersService;
