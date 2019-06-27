BEGIN;

TRUNCATE
  squared_squirrel_users_statistics;

INSERT INTO squared_squirrel_users_statistics (user_id, games_played, lowest_time_win)
VALUES
  (1, 2, 34),
  (2, 4, 0),
  (3, 0, 0),
  (4, 7, 99),
  (5, 0, 0),
  (6, 1, 1);

COMMIT;