describe('login', async function () {
	it('given a previously signed up user, when they login with correct credentials, then it succeeds', async function () {
		await this.robot.signup('test', 'testtest')

		await this.robot.login('test', 'testtest')
	})

	it('given a previously signed up user, when they login with incorrect credentials, then it errors', async function () {
		await this.robot.signup('test', 'testtest')

		try {
			await this.robot.signup('test', 'beepboop')
			assert.fail()
		} catch (e) {}
	})
})
