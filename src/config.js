module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "development",
  CLIENT_ORIGIN: "http://localhost:3000",
  // "https://squared-squirrel-app.felixworks.now.sh",
  DB_URL:
    process.env.DATABASE_URL ||
    "postgresql://squirrel@localhost/squared_squirrel"
};
