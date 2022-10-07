import { createMercuriusTestClient } from 'mercurius-integration-testing';
import build from '../src/server.js';
import 'chai/register-assert.js'
import 'chai/register-expect.js'
import 'chai/register-should.js'

before(async function () {
	this.fastify = await build({
		pgConnectionString: 'postgres://nvandyke@localhost/billboard',
		forceMigration: true,
		logger: {
			level: 'error',
		},
	})

	this.gql = createMercuriusTestClient(this.fastify)
})

beforeEach(async function () {
	await this.fastify.db.q('truncate_tables')
})

after(function () {
	this.fastify.close()
})
