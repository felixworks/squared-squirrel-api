BEGIN;

TRUNCATE
  squared_squirrel_users;

INSERT INTO squared_squirrel_users (username, games_played)
VALUES
  ('dunder', 0),
  ('b.deboop', 5),
  ('c.bloggs', 6),
  ('s.smith', 1),
  ('lexlor', 0),
  ('wippy', 18);

COMMIT;