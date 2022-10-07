import mercurius from 'mercurius'
const { ErrorWithProps } = mercurius

export default {
	Query: {
		me: async (root, args, { user }) => {
			if (!user) throw new ErrorWithProps('Not logged in', {}, 401)
			return {
				id: user.id,
			}
		},
	},
	Mutation: {
		signup: async (root, { name, password }, { repository, reply }) => {
			const user = await repository.createUser(name, password)
			// TODO throw and wrap more specific errors from the repository
			reply.code(201)
			reply.request.session.set('id', user.id)
			return { id: user.id }
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
		favorite: async (root, { songId, isFavorite }, { user, repository }) => {
			if (!user) throw new ErrorWithProps('Not logged in', {}, 401)
			repository.favoriteSong(user.id, songId, isFavorite)
			return { id: songId }
		},
	},
	User: {
		name: async ({ id }, args, { repository }) => {
			const user = await repository.getUserById(id)
			return user.name
		},
		favorites: async ({ id }, args, { repository }) => repository.getFavoriteSongIds(id),
	},
}
