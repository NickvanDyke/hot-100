export default (query) => ({
	favorite: (userId, songId) => query('insert_favorite', [userId, songId]),
	unfavorite: (userId, songId) => query('delete_favorite', [userId, songId]),
	getFavoriteSongIds: (userId) => query('get_favorite_songs', [userId]).then((rows) => rows.map((row) => row.song_id)),
})
