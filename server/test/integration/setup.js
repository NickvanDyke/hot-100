import { createMercuriusTestClient } from 'mercurius-integration-testing';
import build from '../../src/server.js';
import 'chai/register-assert.js'
import { Robot } from './robot.js';

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
	this.robot = new Robot(this.fastify)
})

after(function () {
	this.fastify.close()
})
