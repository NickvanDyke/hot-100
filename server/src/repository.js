export default (fastify) => ({
	createUser: async (name, password) => fastify.db.q('insert_user', [name, password]).then((rows) => rows[0]),
	getUserByName: async (name) => fastify.db.q('get_user_by_name', [name]).then((rows) => rows[0]),
	getUserById: async (id) => fastify.db.q('get_user_by_id', [id]).then((rows) => rows[0]),
	
	createSong: async (title, artist, cover, rank) => fastify.db.q('insert_song', [title, artist, cover, rank]).then((rows) => rows[0]),
	favoriteSong: (userId, songId, isFavorite) => {
		if (isFavorite) {
			fastify.db.q('insert_favorite', [userId, songId])
		} else {
			fastify.db.q('delete_favorite', [userId, songId])
		}
	},

	getTop100: async () => {},
	getFavoriteSongIds: async (userId) => fastify.db.q('get_favorite_song_ids', [userId]).then((rows) => rows.map((row) => row.song_id)),
	
	getSongTitles: async (songIds) => fastify.db.q('get_song_titles', [songIds]).then((rows) => rows.map((row) => row.title)),
	getSongArtists: async (songIds) => fastify.db.q('get_song_artists', [songIds]).then((rows) => rows.map((row) => row.artist)),
	getSongCovers: async (songIds) => fastify.db.q('get_song_covers', [songIds]).then((rows) => rows.map((row) => row.cover)),
	getSongRanks: async (songIds) => fastify.db.q('get_song_rankings', [songIds]).then((rows) => rows.map((row) => row.rank)),
})
