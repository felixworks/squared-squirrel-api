BEGIN;

TRUNCATE
squared_squirrel_users_statistics,
  squared_squirrel_users;

INSERT INTO squared_squirrel_users (username)
VALUES
  ('dunder'),
  ('b.deboop'),
  ('c.bloggs'),
  ('s.smith'),
  ('lexlor'),
  ('wippy');

COMMIT;