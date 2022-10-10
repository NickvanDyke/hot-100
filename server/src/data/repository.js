import { hasBillboardUpdatedSince } from '../util/hasBillboardUpdatedSince.js'

export default (db, billboard) => ({
	createUser: (name, password) => db.insertUser(name, password),
	getUserByName: (name) => db.getUserByName(name),
	getUserById: (id) => db.getUserById(id),

	favoriteSong: (userId, songId, isFavorite) => {
		if (isFavorite) {
			return db.insertFavorite(userId, songId)
		} else {
			return db.deleteFavorite(userId, songId)
		}
	},

	getTop100SongIds: async () => {
		const lastUpdated = await db.getSongsLastUpdated()
		if (!lastUpdated || hasBillboardUpdatedSince(lastUpdated)) {
			const chart = await billboard.getTop100()
			const now = new Date()
			await db.resetSongRanks()
			await Promise.all(
				chart.songs.map(
					async ({ title, artist, cover, rank }) =>
						await db.insertSong(title, artist, cover, rank, now)
				)
			)
		}
		return db.getTop100SongIds()
	},
	getFavoriteSongs: (userId) => db.getFavoriteSongs(userId),

	getSongTitles: (songIds) =>
		db.getSongTitles(songIds),
	getSongArtists: (songIds) =>
		db.getSongArtists(songIds),
	getSongCovers: (songIds) =>
		db.getSongCovers(songIds),
	getSongRanks: (songIds) =>
		db.getSongRanks(songIds),
	getSongTags: async (songIds) => {
		const existingTags = db.getSongTags(songIds)
		for (const [index, existingTag] of existingTags.entries()) {
			if (!existingTag) {
				const songId = songIds[index]
				const song = await db.q('get_song_by_id', [songId]).then((rows) => rows[0])
				// TODO maybe just random element from array for PoC purposes?
				const tags = "hit last.fm api? surely we'll get rate limited with 100 songs lol"
				const topTag = tags[0]
				await db.q('update_song_tag', [songId, topTag])
				existingTags[index] = topTag
			}
		}
		return existingTags
	},
})
