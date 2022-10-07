import { getChart } from 'billboard-top-100'
import { getWeek } from './util.js'

export default (fastify) => ({
	createUser: async (name, password) => fastify.db.q('insert_user', [name, password]).then((rows) => rows[0]),
	getUserByName: async (name) => fastify.db.q('get_user_by_name', [name]).then((rows) => rows[0]),
	getUserById: async (id) => fastify.db.q('get_user_by_id', [id]).then((rows) => rows[0]),

	createSong: async (title, artist, cover) =>
		fastify.db.q('insert_song', [title, artist, cover]).then((rows) => rows[0]),
	favoriteSong: (userId, songId, isFavorite) => {
		if (isFavorite) {
			fastify.db.q('insert_favorite', [userId, songId])
		} else {
			fastify.db.q('delete_favorite', [userId, songId])
		}
	},

	getTop100SongIds: async (year, day) => {
		const date = new Date()
		date.setFullYear(year)
		date.setDate(day)
		const week = getWeek(date)
		const top100Ids = await fastify.db.q('get_top_100', [year, week]).then((rows) => rows.map((row) => row.song_id))
		if (top100Ids.length < 100) {
			const chart = await new Promise((resolve, reject) => {
				const dateString = date.toISOString().split('T')[0]
				getChart('hot-100', dateString, (err, chart) => {
					if (err) reject(err)
					else resolve(chart)
				})
			})
			for (const song of chart.songs) {
				const { title, artist, cover, rank } = song
				try {
					const newSongId = await fastify.db.q('insert_song', [title, artist, cover]).then((rows) => rows[0].id)
					await fastify.db.q('insert_rank', [newSongId, year, week, rank])
					top100Ids.push(newSongId)
				} catch (e) {
					// Probably just already exists from a past scrape
				}
			}
		}

		return top100Ids
	},
	getFavoriteSongIds: async (userId) =>
		fastify.db.q('get_favorite_song_ids', [userId]).then((rows) => rows.map((row) => row.song_id)),

	getSongTitles: (songIds) =>
		fastify.db.q('get_song_titles', [songIds]).then((rows) => rows.map((row) => row.title)),
	getSongArtists: (songIds) =>
		fastify.db.q('get_song_artists', [songIds]).then((rows) => rows.map((row) => row.artist)),
	getSongCovers: (songIds) =>
		fastify.db.q('get_song_covers', [songIds]).then((rows) => rows.map((row) => row.cover)),
	getSongRanks: (songIds, year, day) => {
		const date = new Date()
		date.setFullYear(year)
		date.setDate(day)
		const week = getWeek(date, 6)
		return fastify.db.q('get_song_ranks', [songIds, year, week]).then((rows) => rows.map((row) => row.rank))
	},
	getSongTags: async (songIds) => {
		const existingTags = fastify.db.q('get_song_tags', [songIds]).then((rows) => rows.map((row) => row.tag))
		for (const [index, existingTag] of existingTags.entries()) {
			if (!existingTag) {
				const songId = songIds[index]
				const song = await fastify.db.q('get_song_by_id', [songId]).then((rows) => rows[0])
				// TODO
				const tags = "hit last.fm api? surely we'll get rate limited with 100 songs lol"
				const topTag = tags[0]
				await fastify.db.q('update_song_tag', [songId, topTag])
				existingTags[index] = topTag
			}
		}
		return existingTags
	},
})
