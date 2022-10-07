import { auth, gql } from './util.js'

describe('favorite', async function () {
	beforeEach(async function () {
		this.user = await this.fastify.repository.createUser('test', 'testtest')
		this.song = await this.fastify.repository.createSong('artist', 'title', 'cover')
	})

	describe('when logged in', async function () {
		beforeEach(async function () {
			await auth(this.fastify, this.gql, 'test', 'testtest')
		})

		it('favorites a song', async function () {
			const res = await this.gql.mutate(gql`
				mutation {
					favorite(songId: ${this.song.id}, isFavorite: true) {
						id
						isFavorite
					}
				}
			`)

			assert.deepEqual(res, {
				data: {
					favorite: {
						id: this.song.id,
						isFavorite: true,
					},
				},
			})
			const favorites = await this.fastify.repository.getFavoriteSongIds(this.user.id)
			assert.deepEqual(favorites, [this.song.id])
		})

		it('unfavorites a song', async function () {
			await this.fastify.repository.favoriteSong(this.user.id, this.song.id, true)
			const res = await this.gql.mutate(gql`
				mutation {
					favorite(songId: ${this.song.id}, isFavorite: false) {
						id
						isFavorite
					}
				}
			`)

			assert.deepEqual(res, {
				data: {
					favorite: {
						id: this.song.id,
						isFavorite: false,
					},
				},
			})
			const favorites = await this.fastify.repository.getFavoriteSongIds(this.user.id)
			assert.deepEqual(favorites, [])
		})
	})

	it('errors when not logged in', async function () {
		const res = await this.gql.mutate(gql`
			mutation {
				favorite(songId: ${this.song.id}, isFavorite: true) {
					id
					isFavorite
				}
			}
		`)

		assert.equal(res.errors[0].message, 'Not logged in')
	})
})
