export default (query) => ({
	createOrUpdate: (title, artist, cover, rank, timestamp) =>
		query('upsert_song', [title, artist, cover, rank, timestamp]).then((rows) => rows[0]),
	get: (ids, fields) => query('get_songs', [ids, ...fields]),

	getTop100Ids: () => query('get_top_100').then((rows) => rows.map((row) => row.id)),
	getLastUpdated: () => query('get_songs_last_updated').then((rows) => rows[0].max),

	getTitles: (songIds) => query('get_song_titles', [songIds]).then((rows) => rows.map((row) => row.title)),
	getArtists: (songIds) => query('get_song_artists', [songIds]).then((rows) => rows.map((row) => row.artist)),
	getCovers: (songIds) => query('get_song_covers', [songIds]).then((rows) => rows.map((row) => row.cover)),
	getRanks: (songIds) => query('get_song_ranks', [songIds]).then((rows) => rows.map((row) => row.rank)),
	getTags: async (songIds) => query('get_song_tags', [songIds]).then((rows) => rows.map((row) => row.tag)),

	resetRanks: () => query('reset_song_ranks'),

	// getSongTags: async (songIds) => {
	// 	const existingTags = db.getSongTags(songIds)
	// 	for (const [index, existingTag] of existingTags.entries()) {
	// 		if (!existingTag) {
	// 			const songId = songIds[index]
	// 			const song = await db.q('get_song_by_id', [songId]).then((rows) => rows[0])
	// 			// TODO maybe just random element from array for PoC purposes?
	// 			const tags = "hit last.fm api? surely we'll get rate limited with 100 songs lol"
	// 			const topTag = tags[0]
	// 			await db.q('update_song_tag', [songId, topTag])
	// 			existingTags[index] = topTag
	// 		}
	// 	}
	// 	return existingTags
	// },
})
