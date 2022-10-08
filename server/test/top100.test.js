import { gql } from './util.js'

describe('top 100', async function () {
	// Ideally we should inject a mocked API so we can control the response and assert
	// specific values on it. And not get rate limited while testing lol.
	it('retrieves, stores and returns the top 100 songs for the week', async function () {
		const res = await this.gql.mutate(gql`
			query {
				top100 {
					title
					artist
					cover
					rank
				}
			}
		`)
		
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