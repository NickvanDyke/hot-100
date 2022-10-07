CREATE TABLE song (
	id SERIAL PRIMARY KEY,
	title TEXT NOT NULL,
	artist TEXT NOT NULL,
	album TEXT NOT NULL,
	ranking INTEGER
);

CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	name TEXT NOT NULL UNIQUE CHECK(LENGTH(name) > 0),
	password TEXT NOT NULL CHECK(LENGTH(password) > 7)
);

CREATE TABLE favorite (
	user_id INTEGER NOT NULL REFERENCES users(id),
	song_id INTEGER NOT NULL REFERENCES song(id),
	PRIMARY KEY (user_id, song_id)
);