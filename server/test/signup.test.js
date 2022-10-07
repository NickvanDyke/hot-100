import fastify from 'fastify'
import { gql } from './util.js'

describe('signup', async function () {
	it('creates a new user', async function () {
		const res = await this.gql.mutate(gql`
			mutation {
				signup(name: "test", password: "testtest") {
					name
				}
			}
		`)
		
		assert.equal(res.data.signup.name, 'test')
		assert.isOk(await this.fastify.repository.getUserByName("test"))
	})
	
	it('errors if the username is already in use', async function () {
		await this.fastify.repository.createUser("test", "testtest")
		const res = await this.gql.mutate(gql`
			mutation {
				signup(name: "test", password: "testtest") {
					name
				}
			}
		`)

		assert.isOk(res.errors)
	})
	
	it('errors if username is blank', async function () {
		const res = await this.gql.mutate(gql`
			mutation {
				signup(name: "", password: "testtest") {
					name
				}
			}
		`)

		assert.isOk(res.errors)
	})

	it('errors if password is too short', async function () {
		const res = await this.gql.mutate(gql`
			mutation {
				signup(name: "test", password: "test") {
					name
				}
			}
		`)

		assert.isOk(res.errors)
	})
})