import repository from '../../src/data/repository.js'

describe('repository', async function () {
	describe('getTop100', async function () {
		it('given getTop100 has already been called once, when its called again in the same week, then it shouldnt hit the API again', async function () {
			const billboard = new FakeBillboard()
			const repo = repository(new FakeDb(), billboard)
			await repo.getTop100SongIds()
			assert.equal(billboard.numCalls, 1)

			await repo.getTop100SongIds()

			assert.equal(billboard.numCalls, 1)
		})
	})
})

class FakeBillboard {
	numCalls = 0

	getTop100() {
		this.numCalls++
		return {
			songs: [
				{
					title: 'song1',
					artist: 'artist1',
					cover: 'cover1',
					rank: 1,
				},
			],
		}
	}
}

class FakeDb {
	songs = []
	lastUpdated = null

	getSongsLastUpdated() {
		return this.lastUpdated
	}
	getTop100SongIds() {
		return this.songs.map((song, index) => index)
	}
	insertSong(title, artist, cover, rank, timestamp) {
		this.songs.push({
			title,
			artist,
			cover,
			rank,
			timestamp,
		})
		this.lastUpdated = Date.now()
	}
	resetSongRanks() {}
}
