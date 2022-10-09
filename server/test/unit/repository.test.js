describe('repository', async function () {
	describe('getTop100', async function () {
		it('given getTop100 has already been called once, when its called again in the same week, then it shouldnt hit the API again', async function () {
			const repository = repository()
			await repository.getTop100()
			
			await repository.getTop100()
			
			assert.equal(repository.getTop100.callCount, 1)
		})
	})
})