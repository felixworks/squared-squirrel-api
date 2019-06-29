const clientValue = () => {
  if (process.env.NODE_ENV === production) {
    return "https://squared-squirrel-app.felixworks.now.sh";
  } else return "http://localhost:3000";
};

module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "development",
  CLIENT_ORIGIN: clientValue,
  DB_URL:
    process.env.DATABASE_URL ||
    "postgresql://squirrel@localhost/squared_squirrel"
};
