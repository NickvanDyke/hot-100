import { createMercuriusTestClient } from 'mercurius-integration-testing';
import build from '../../src/server.js';
import 'chai/register-assert.js'
import { Robot } from './robot.js';
import db from '../../src/data/db.js';

before(async function () {
	this.fastify = await build({
		pgConnectionString: 'postgres://nvandyke@localhost/billboard',
		forceMigration: true,
		logger: {
			level: 'error',
		},
	})
	
	this.db = db(this.fastify.pg)
	this.gql = createMercuriusTestClient(this.fastify)
})

beforeEach(async function () {
	await this.db.q('truncate_tables')
	this.robot = new Robot(this.fastify)
})

after(function () {
	this.fastify.close()
})
