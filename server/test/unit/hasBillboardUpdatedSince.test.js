import getLastMonday from '../../src/util/getLastMonday.js'
import hasBillboardUpdatedSince from '../../src/util/hasBillboardUpdatedSince.js'

describe('hasBillboardUpdatedSince', async function () {
	it('when the timestamp is after most recent monday, then it returns false', async function () {
		const date = getLastMonday(new Date())
		date.setDate(date.getDate() + 1)
		assert.isFalse(hasBillboardUpdatedSince(date.getTime()))
	})

	it('when the timestamp is before most recent monday, then it returns true', async function () {
		const date = getLastMonday(new Date())
		date.setDate(date.getDate() - 1)
		assert.isTrue(hasBillboardUpdatedSince(date.getTime()))
	})
})
