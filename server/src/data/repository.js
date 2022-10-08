import { getTop100 } from './billboard.js'
import { hasBillboardUpdatedSince } from '../util/hasBillboardUpdatedSince.js'

export default (fastify) => ({
	createUser: async (name, password) => fastify.db.q('insert_user', [name, password]).then((rows) => rows[0]),
	getUserByName: async (name) => fastify.db.q('get_user_by_name', [name]).then((rows) => rows[0]),
	getUserById: async (id) => fastify.db.q('get_user_by_id', [id]).then((rows) => rows[0]),

	favoriteSong: (userId, songId, isFavorite) => {
		if (isFavorite) {
			return fastify.db.q('insert_favorite', [userId, songId])
		} else {
			return fastify.db.q('delete_favorite', [userId, songId])
		}
	},

	getTop100SongIds: async () => {
		const lastUpdated = await fastify.db.q('get_songs_last_updated').then((rows) => rows[0].max)
		if (!lastUpdated || hasBillboardUpdatedSince(lastUpdated)) {
			const chart = await getTop100()
			const now = new Date()
			await fastify.db.q('reset_song_ranks')
			const top100Ids = await Promise.all(
				chart.songs.map(
					async ({ title, artist, cover, rank }) =>
						await fastify.db.q('insert_song', [title, artist, cover, rank, now]).then((rows) => rows[0].id)
				)
			)
			return top100Ids
		} else {
			return await fastify.db.q('get_top_100').then((rows) => rows.map((row) => row.song_id))
		}
	},
	getFavoriteSongs: async (userId) => fastify.db.q('get_favorite_songs', [userId]),

	getSongTitles: (songIds) => fastify.db.q('get_song_titles', [songIds]).then((rows) => rows.map((row) => row.title)),
	getSongArtists: (songIds) =>
		fastify.db.q('get_song_artists', [songIds]).then((rows) => rows.map((row) => row.artist)),
	getSongCovers: (songIds) => fastify.db.q('get_song_covers', [songIds]).then((rows) => rows.map((row) => row.cover)),
	getSongRanks: (songIds) => fastify.db.q('get_song_ranks', [songIds]).then((rows) => rows.map((row) => row.rank)),
	getSongTags: async (songIds) => {
		const existingTags = fastify.db.q('get_song_tags', [songIds]).then((rows) => rows.map((row) => row.tag))
		for (const [index, existingTag] of existingTags.entries()) {
			if (!existingTag) {
				const songId = songIds[index]
				const song = await fastify.db.q('get_song_by_id', [songId]).then((rows) => rows[0])
				// TODO maybe just random element from array for PoC purposes?
				const tags = "hit last.fm api? surely we'll get rate limited with 100 songs lol"
				const topTag = tags[0]
				await fastify.db.q('update_song_tag', [songId, topTag])
				existingTags[index] = topTag
			}
		}
		return existingTags
	},
})
