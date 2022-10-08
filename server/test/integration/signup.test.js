describe('signup', async function () {
	it('given a unique name, when the user signs up, then it succeeds', async function () {
		await this.robot.signup()
	})

	it('given a name that is already in use, when the user signs up, then it errors', async function () {
		await this.robot.signup('name')
		try {
			await this.robot.signup('name')
			assert.fail()
		} catch (e) {}
	})

	it('when the user signs up with a blank name, then it errors', async function () {
		try {
			await this.robot.signup('')
			assert.fail()
		} catch (e) {}
	})

	it('when the user signs up with a too short password, then it errors', async function () {
		try {
			await this.robot.signup('name', 'short')
			assert.fail()
		} catch (e) {}
	})
})
