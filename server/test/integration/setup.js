import 'chai/register-assert.js'
import fs from 'fs'
import { createMercuriusTestClient } from 'mercurius-integration-testing'
import build from '../../src/server.js'
import { Robot } from './robot.js'

before(async function () {
	this.fastify = await build({
		pgConnectionString: 'postgres://nvandyke@localhost/billboard',
		forceMigration: true,
		logger: {
			level: 'error',
		},
	})

	this.gql = createMercuriusTestClient(this.fastify)
	const query = (path, args) =>
		this.fastify.pg.query(fs.readFileSync('./sql/' + path + '.psql').toString(), args).then((res) => res.rows)
	this.fastify.decorate('query', query)
})

beforeEach(async function () {
	await this.fastify.query('truncate_tables')
	this.robot = new Robot(this.fastify)
})

after(function () {
	this.fastify.close()
})
