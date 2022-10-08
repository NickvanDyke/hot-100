describe.only('favorite', async function () {
	beforeEach(async function () {
		this.song = await this.fastify.db
			.q('insert_song', ['title', 'artist', 'cover', 1, new Date()])
			.then((rows) => rows[0])
	})

	describe('when logged in', async function () {
		beforeEach(async function () {
			await this.robot.signup()
		})

		it('favorites a song', async function () {
			await this.robot.favorite(this.song.id, true)
			const favorites = await this.robot.getFavorites()

			assert.deepEqual(favorites, [{
				title: this.song.title,
				artist: this.song.artist,
				cover: this.song.cover,
				rank: this.song.rank
			}])
		})

		it('unfavorites a favorited song', async function () {
			await this.robot.favorite(this.song.id, true)

			await this.robot.favorite(this.song.id, false)
			const favorites = await this.robot.getFavorites()

			assert.deepEqual(favorites, [])
		})
	})

	it('errors when not logged in', async function () {
		try {
			await this.robot.favorite(this.song.id, true)
			assert.fail()
		} catch (e) {
			assert(e.message == 'Not logged in')
		}
	})
})
