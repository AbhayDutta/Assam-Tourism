-- PostgreSQL schema for the Intelligent Cultural Tourism Experience Engine for Assam
-- Run this in your Neon Postgres instance.

CREATE TABLE IF NOT EXISTS districts (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,              -- e.g. 'guwahati', 'majuli'
  name TEXT NOT NULL,                     -- Display name
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL
);

CREATE TYPE experience_category AS ENUM (
  'festival',
  'cuisine',
  'craft',
  'heritage',
  'folk_art',
  'other'
);

CREATE TYPE experience_status AS ENUM (
  'pending',
  'approved',
  'rejected'
);

CREATE TABLE IF NOT EXISTS experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  district_slug TEXT NOT NULL REFERENCES districts(slug) ON DELETE CASCADE,
  category experience_category NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  media_url TEXT,                          -- Cloudinary URL for image/video
  tags TEXT[] DEFAULT '{}',
  contributor_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status experience_status NOT NULL DEFAULT 'pending'
);

-- Seed a few key districts used by the minimal UI.
INSERT INTO districts (slug, name, latitude, longitude)
VALUES
  ('guwahati', 'Guwahati', 26.1445, 91.7362),
  ('majuli', 'Majuli', 27.0, 94.2),
  ('sivasagar', 'Sivasagar', 26.9985, 94.6376)
ON CONFLICT (slug) DO NOTHING;

