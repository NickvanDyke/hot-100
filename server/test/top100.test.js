import { gql } from './util.js'

describe.only('top 100', async function () {
	// TODO should prolly mock the chart and tag responses so we don't get rate limited from tests
	it('retrieves, stores and returns the top 100 songs for the week', async function () {
		const today = new Date()
		const year = today.getFullYear()
		const day = today.getDate()
		const res = await this.gql.mutate(gql`
			query {
				top100(year: ${year}, day: ${day}) {
					title
					artist
					cover
					rank
				}
			}
		`)
		
		console.log(res)
		assert.equal(res.data.top100.length, 100)
		res.data.top100.forEach((song, index) => {
			assert.isOk(song.title)
			assert.isOk(song.artist)
			assert.isOk(song.cover)
			assert.isOk(song.title)
			assert.equal(index, song.rank - 1)
		})
	})
	
	describe('with login and favorites', async function () {
		it('includes the users favorites')
	})
})