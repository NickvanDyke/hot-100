describe('top 100', async function () {
	// Ideally we should inject a mocked API so we can control the response and assert
	// specific values on it. And not get rate limited while testing lol.
	it('given we arent logged in, when we retrieve the top 100 songs, then there are 100 of them in ascending rank with valid data and none are marked favorite', async function () {
		const top100 = await this.robot.getTop100()

		assert.equal(top100.length, 100)
		top100.forEach((song, index) => {
			assert.isOk(song.id)
			assert.isOk(song.title)
			assert.isOk(song.artist)
			assert.isOk(song.cover)
			assert.isOk(song.title)
			assert.isFalse(song.isFavorite)
			assert.equal(index + 1, song.rank)
		})
	})

	it('given we have logged in and favorited a song, when we retrieve top 100, then that song is marked as favorited', async function () {
		await this.robot.signup()
		const top100 = await this.robot.getTop100()
		const favoriteId = top100[0].id
		await this.robot.favorite(favoriteId, true)
		
		const top100AfterFavorite = await this.robot.getTop100()
		assert.isTrue(top100AfterFavorite.find(({id}) => id == favoriteId).isFavorite)
	})
})
