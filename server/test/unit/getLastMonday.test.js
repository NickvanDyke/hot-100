import getLastMonday from '../../src/util/getLastMonday.js'

describe('getLastMonday', async function () {
	it('returns the last monday', async function () {
		const date = new Date('2022-10-08') // Saturday
		const lastMonday = getLastMonday(date)
		assert.equal(lastMonday.toISOString(), '2022-10-03T00:00:00.000Z')
		assert.equal(lastMonday.getUTCDay(), 1)
	})
})
