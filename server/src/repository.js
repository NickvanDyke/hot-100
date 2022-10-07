export default (fastify) => ({
	getUserByName: async (name) => fastify.db.q('get_user_by_name', [name]).then((rows) => rows[0]),
	createUser: async (name, password) => fastify.db.q('insert_user', [name, password]).then((rows) => rows[0].id),
	
	getUserNames: (ids) => fastify.db.q('get_user_names', [ids]).then((users) => users.map((user) => user.name)),

	getTop100: async () => {
	}
})