import GetTop100SongsUseCase from '../../src/usecase/getTop100Songs.js'

describe('GetTop100Songs', async function () {
	it('given getTop100 has already been used once, when its used again in the same week, then it shouldnt hit the API again', async function () {
		const billboardAdapter = new FakeBillboardAdapter()
		const usecase = GetTop100SongsUseCase(new FakeSongAdapter(), billboardAdapter)
		assert.equal(billboardAdapter.numCalls, 0)
		await usecase()
		assert.equal(billboardAdapter.numCalls, 1)

		await usecase()

		assert.equal(billboardAdapter.numCalls, 1)
	})
})

class FakeBillboardAdapter {
	songs = [
		{
			title: 'song1',
			artist: 'artist1',
			cover: 'cover1',
			rank: 1,
		},
	]
	numCalls = 0
	
	async getLatestTop100() {
		this.numCalls++
		return this.songs
	}
}


class FakeSongAdapter {
	songs = []
	lastUpdated = null
	numCalls = 0

	getLastUpdated() {
		return this.lastUpdated
	}
	getTop100Ids() {
		return this.songs.map((song) => song.id)
	}
	createOrUpdate(title, artist, cover, rank, timestamp) {
		this.songs.push({
			title,
			artist,
			cover,
			rank,
			timestamp,
		})
		this.lastUpdated = Date.now()
	}
	resetRanks() {}
}
