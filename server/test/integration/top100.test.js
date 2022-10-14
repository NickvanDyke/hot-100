describe('top 100', async function () {
	// Ideally we should inject a mocked API so we can control the response and assert
	// specific values on it. And not get rate limited while testing lol.
	it('when we retrieve the top 100 songs, then there are 100 of them in ascending rank with valid data', async function () {
		const top100 = await this.robot.getTop100()

		assert.equal(top100.length, 100)
		top100.forEach((song, index) => {
			assert.isOk(song.id)
			assert.isOk(song.title)
			assert.isOk(song.artist)
			assert.isOk(song.cover)
			assert.isOk(song.title)
			assert.equal(index + 1, song.rank)
		})
	})
})
