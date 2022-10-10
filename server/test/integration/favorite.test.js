describe('favorite', async function () {
	beforeEach(async function () {
		this.song = await this.db.insertSong('title', 'artist', 'cover', 1, new Date())
	})

	describe('given the user is logged in', async function () {
		beforeEach(async function () {
			await this.robot.signup()
		})

		it('when they favorite a song and retrieve their favorites, then it includes the favorited song', async function () {
			await this.robot.favorite(this.song.id, true)
			const favorites = await this.robot.getFavorites()

			assert.deepEqual(favorites, [
				{
					title: this.song.title,
					artist: this.song.artist,
					cover: this.song.cover,
					rank: this.song.rank,
					isFavorite: true,
				},
			])
		})

		it('given one favorited song, when the user unfavorites it and retrieves their favorites, then the favorites are empty', async function () {
			await this.robot.favorite(this.song.id, true)

			await this.robot.favorite(this.song.id, false)
			const favorites = await this.robot.getFavorites()

			assert.deepEqual(favorites, [])
		})
	})

	it('given the user is not logged in, when they favorite a song, then it errors', async function () {
		try {
			await this.robot.favorite(this.song.id, true)
			assert.fail()
		} catch (e) {
			assert(e.message == 'Not logged in')
		}
	})
})
