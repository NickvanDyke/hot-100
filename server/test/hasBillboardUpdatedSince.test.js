import { getLastMonday } from '../src/util/getLastMonday.js'
import { hasBillboardUpdatedSince } from '../src/util/hasBillboardUpdatedSince.js'

describe('hasBillboardUpdatedSince', async function () {
	it('returns false when timestamp is after most recent monday', async function () {
		const date = getLastMonday(new Date())
		date.setDate(date.getDate() + 1)
		assert.isFalse(hasBillboardUpdatedSince(date.getTime()))
	})
	
	it('returns true when timestamp is before most recent monday', async function () {
		const date = getLastMonday(new Date())
		date.setDate(date.getDate() - 1)
		assert.isTrue(hasBillboardUpdatedSince(date.getTime()))
	})
})