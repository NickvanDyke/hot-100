export default {
	Query: {},
	Mutation: {
		signup: async (root, { name, password }, { repository, reply }) => {
			const id = await repository.createUser(name, password)
			reply.code(201)
			return { id }
		},
	},
}
