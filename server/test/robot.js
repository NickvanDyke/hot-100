import { gql } from './util.js'
import { createMercuriusTestClient } from 'mercurius-integration-testing';

export class Robot {
	constructor(fastify) {
		this.fastify = fastify
		this.gql = createMercuriusTestClient(fastify)
	}

	async signup(name = 'test', password = 'password123') {
		const res = await this.fastify.inject({
			method: 'POST',
			url: '/graphql',
			headers: {
				'content-type': 'application/json',
			},
			payload: JSON.stringify({
				query: `
					mutation {
						signup(name: "${name}", password: "${password}") {
							name
						}
					}
				`,
			}),
		})

		assert.equal(JSON.parse(res.body).data.signup.name, name)
		this.gql.setCookies({ session: res.cookies[0].value })
	}

	async login(name = 'test', password = 'password123') {
		const res = await this.fastify.inject({
			method: 'POST',
			url: '/graphql',
			headers: {
				'content-type': 'application/json',
			},
			payload: JSON.stringify({
				query: `
					mutation {
						login(name: "${name}", password: "${password}") {
							name
						}
					}
				`,
			}),
		})

		assert.equal(JSON.parse(res.body).data.login.name, name)
		this.gql.setCookies({ session: res.cookies[0].value })
	}

	async getTop100() {}

	async favorite(songId, isFavorite) {
		const res = await this.gql.mutate(gql`
			mutation {
				favorite(songId: ${songId}, isFavorite: ${isFavorite}) {
					id
					isFavorite
				}
			}
		`)

		if (res.errors) throw new Error(res.errors[0].message)

		assert.deepEqual(res, {
			data: {
				favorite: {
					id: songId,
					isFavorite: isFavorite,
				},
			},
		})
	}

	async getFavorites() {
		const res = await this.gql.query(gql`
			query {
				user {
					favorites {
						title
						artist
						cover
						rank
					}
				}
			}
		`)
		
		return res.data.user.favorites
	}
}
