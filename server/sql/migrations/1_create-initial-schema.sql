CREATE TABLE song (
	id SERIAL PRIMARY KEY,
	title TEXT NOT NULL,
	artist TEXT NOT NULL,
	cover TEXT NOT NULL,
	rank INTEGER,
	tag TEXT,
	last_updated TIMESTAMP NOT NULL,
	UNIQUE(title, artist)
);

-- CREATE TABLE rank (
-- 	id SERIAL PRIMARY KEY,
-- 	-- not sure if this is the best approach for storing the time
-- 	year INTEGER NOT NULL,
-- 	week INTEGER NOT NULL CHECK (week >= 1 AND week <= 52),
-- 	song_id INTEGER REFERENCES song(id) ON DELETE CASCADE,
-- 	rank INTEGER NOT NULL CHECK(rank > 0),
-- 	UNIQUE(year, week, song_id)
-- );

-- CREATE TABLE tag (
-- 	id SERIAL PRIMARY KEY,
-- 	song_id INTEGER REFERENCES song(id) ON DELETE CASCADE,
-- 	name TEXT NOT NULL,
-- 	UNIQUE(song_id, name)
-- );

CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	name TEXT NOT NULL UNIQUE CHECK(LENGTH(name) > 0 AND LENGTH(name) < 20),
	password TEXT NOT NULL CHECK(LENGTH(password) > 7)
);

CREATE TABLE favorite (
	user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	song_id INTEGER NOT NULL REFERENCES song(id) ON DELETE CASCADE,
	PRIMARY KEY (user_id, song_id)
);