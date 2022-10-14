describe('favorite', async function () {
	beforeEach(async function () {
		this.song = await this.fastify.query('upsert_song', ['title', 'artist', 'cover', 1, new Date()]).then((rows) => rows[0])
	})

	describe('given the user is logged in', async function () {
		beforeEach(async function () {
			await this.robot.signup()
		})

		it('when they favorite a song and retrieve their favorites, then it includes the favorited song', async function () {
			await this.robot.favorite(this.song.id)
			const favorites = await this.robot.getMyFavorites()

			assert.deepEqual(favorites, [
				{
					title: this.song.title,
					artist: this.song.artist,
					cover: this.song.cover,
					rank: this.song.rank,
				},
			])
		})

		it('given one favorited song, when the user unfavorites it and retrieves their favorites, then the favorites are empty', async function () {
			await this.robot.favorite(this.song.id)

			await this.robot.unfavorite(this.song.id)
			const favorites = await this.robot.getMyFavorites()

			assert.deepEqual(favorites, [])
		})
	})

	it('given the user is not logged in, when they favorite a song, then it errors', async function () {
		try {
			await this.robot.favorite(this.song.id)
			assert.fail()
		} catch (e) {
			assert(e.message == 'Not logged in')
		}
	})
})
