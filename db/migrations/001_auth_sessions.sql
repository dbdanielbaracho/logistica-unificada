BEGIN;
CREATE TABLE auth_sessions (
  digest text PRIMARY KEY CHECK (digest ~ '^[0-9a-f]{64}$'),
  user_id text NOT NULL CHECK (length(btrim(user_id)) > 0),
  created_at bigint NOT NULL CHECK (created_at BETWEEN 0 AND 9007199254740991),
  expires_at bigint NOT NULL CHECK (expires_at > created_at AND expires_at <= 9007199254740991),
  revoked_at bigint CHECK (revoked_at BETWEEN 0 AND 9007199254740991)
);
CREATE INDEX auth_sessions_user_idx ON auth_sessions (user_id);
CREATE INDEX auth_sessions_expiry_idx ON auth_sessions (expires_at);
COMMIT;
