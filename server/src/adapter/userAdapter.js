export default (query) => ({
	create: async (name, password) => query('insert_user', [name, password]).then((rows) => rows[0].id),
	getById: async (id) => query('get_user_by_id', [id]).then((rows) => rows[0]),
	getByName: async (name) => query('get_user_by_name', [name]).then((rows) => rows[0]),
})
