CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS albums (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT        NOT NULL,
  description TEXT        NOT NULL DEFAULT '',
  cover_key   TEXT        NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS photos (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id      UUID        NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
  title         TEXT        NOT NULL DEFAULT '',
  description   TEXT        NOT NULL DEFAULT '',
  stock         TEXT        NOT NULL DEFAULT '',
  year          INT         NOT NULL DEFAULT 0,
  image_key     TEXT        NOT NULL,
  height        INT         NOT NULL DEFAULT 320,
  display_order INT         NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS photos_album_id_idx ON photos(album_id);
CREATE INDEX IF NOT EXISTS photos_display_order_idx ON photos(album_id, display_order);
