before(async function () {
	this.fastify = await build({
		pgConnectionString: 'postgres://postgres@localhost/billboard',
		forceMigration: true,
		logger: {
			level: 'error',
			prettyPrint: true,
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
