BEGIN;

TRUNCATE
  squared_squirrel_users_statistics;

INSERT INTO squared_squirrel_users_statistics (user_id, games_played, games_won, lowest_time_win)
VALUES
  (1, 2, 34, 30),
  (2, 4, 0, 60),
  (3, 0, 0, 10),
  (4, 7, 99, null),
  (5, 0, 0, 20),
  (6, 1, 1, null);

COMMIT;