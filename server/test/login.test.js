import { gql } from './util.js'
describe('login', async function () {
	beforeEach(async function () {
		await this.fastify.repository.createUser('test', 'testtest')
	})

	it('succeeds with correct credentials', async function () {
		const res = await this.gql.mutate(gql`
			mutation {
				login(name: "test", password: "testtest") {
					name
				}
			}
		`)

		assert.equal(res.data.login.name, 'test')
	})

	it('errors when password doesnt match', async function () {
		const res = await this.gql.mutate(gql`
			mutation {
				login(name: "test", password: "beepboop") {
					name
				}
			}
		`)
		
		assert.equal(res.errors[0].message, 'Invalid credentials')
	})
})
