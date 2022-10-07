import mercurius from 'mercurius'
const { ErrorWithProps } = mercurius

export default {
	Query: {},
	Mutation: {
		signup: async (root, { name, password }, { repository, reply }) => {
			const id = await repository.createUser(name, password)
			// TODO throw and wrap more specific errors from the repository
			reply.code(201)
			reply.request.session.set('id', id)
			return { id }
		},
		login: async (root, { name, password }, { repository, reply }) => {
			const user = await repository.getUserByName(name)
			if (!user || user.password !== password) {
				throw new ErrorWithProps('Invalid credentials', {}, 401)
			} else {
				reply.request.session.set('id', user.id)
				return { id: user.id }
			}
		},
	},
}
