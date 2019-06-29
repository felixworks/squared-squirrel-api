module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "development",
  CLIENT_ORIGIN: "localhost:3000",
  DB_URL:
    process.env.DATABASE_URL ||
    "postgresql://squirrel@localhost/squared_squirrel"
};
