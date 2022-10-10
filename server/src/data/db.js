import fs from 'fs'

export default (pg) => {
	const query = (path, args) =>
		pg.query(fs.readFileSync('./sql/' + path + '.psql').toString(), args).then((res) => res.rows)

	return {
		insertUser: async (name, password) =>
			query('insert_user', [name, password]).then((rows) => rows[0]),
		getUserByName: async (name) => query('get_user_by_name', [name]).then((rows) => rows[0]),
		getUserById: async (id) => query('get_user_by_id', [id]).then((rows) => rows[0]),

		insertFavorite: (userId, songId) => query('insert_favorite', [userId, songId]),
		deleteFavorite: (userId, songId) => query('delete_favorite', [userId, songId]),
		getFavoriteSongs: (userId) => query('get_favorite_songs', [userId]),

		getSongsLastUpdated: () => query('get_songs_last_updated').then((rows) => rows[0].max),
		resetSongRanks: () => query('reset_song_ranks'),
		insertSong: (title, artist, cover, rank, timestamp) =>
			query('insert_song', [title, artist, cover, rank, timestamp]).then((rows) => rows[0]),

		getTop100SongIds: () => query('get_top_100').then((rows) => rows.map((row) => row.id)),
		getFavoriteSongs: async (userId) => query('get_favorite_songs', [userId]),

		getSongTitles: (songIds) =>
			query('get_song_titles', [songIds]).then((rows) => rows.map((row) => row.title)),
		getSongArtists: (songIds) =>
			query('get_song_artists', [songIds]).then((rows) => rows.map((row) => row.artist)),
		getSongCovers: (songIds) =>
			query('get_song_covers', [songIds]).then((rows) => rows.map((row) => row.cover)),
		getSongRanks: (songIds) =>
			query('get_song_ranks', [songIds]).then((rows) => rows.map((row) => row.rank)),
		getSongTags: async (songIds) =>
			query('get_song_tags', [songIds]).then((rows) => rows.map((row) => row.tag)),
		
		truncateTables: () => query('truncate_tables'),
	}
}
