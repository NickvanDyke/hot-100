import fastify from 'fastify'
import { gql } from './util.js'

describe('signup', async function () {
	it('creates a new user', async function () {
		const res = await this.gql.mutate(gql`
			mutation {
				signup(name: "test", password: "test") {
					name
				}
			}
		`)
		
		assert.equal(res.data.signup.name, 'test')
		assert.isOk(await this.fastify.repository.getUserByName("test"))
	})
	
	it('errors if the username is already in use', async function () {
		
	})
	
	it('errors if username or password are invalid', async function () {
		
	})
})