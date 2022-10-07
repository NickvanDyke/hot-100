CREATE TABLE song (
	id SERIAL PRIMARY KEY,
	title TEXT NOT NULL,
	artist TEXT NOT NULL,
	album TEXT NOT NULL,
	ranking INTEGER
);

CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	name TEXT NOT NULL,
	password TEXT NOT NULL
);

CREATE TABLE favorite (
	user_id INTEGER NOT NULL REFERENCES users(id),
	song_id INTEGER NOT NULL REFERENCES song(id),
	PRIMARY KEY (user_id, song_id)
);