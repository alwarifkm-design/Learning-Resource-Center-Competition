INSERT INTO users (
  username,
  password_hash,
  role,
  is_active,
  created_at
)
VALUES (
  'Alwarif',
  '9925845893b3a2376663722f011137014fec40f655b4d9ecc2cad6c027dfb5d0',
  'admin',
  true,
  NOW()
)
ON CONFLICT (username) DO UPDATE
SET
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active;

INSERT INTO settings (key, value)
VALUES ('security_code', '"Alwarif123"')
ON CONFLICT (key) DO UPDATE
SET value = EXCLUDED.value;
