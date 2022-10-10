import mercurius from 'mercurius'
const { ErrorWithProps } = mercurius

export default {
	Query: {
		user: async (root, { id }, { user }) => {
			if (!id && !user) throw new ErrorWithProps('Not logged in', {}, 401)
			return {
				id: id || user.id,
			}
		},
		top100: async (root, args, { repository }) => {
			const songIds = await repository.getTop100SongIds()
			return songIds.map((id) => ({ id }))
		},
	},
	Mutation: {
		signup: async (root, { name, password }, { repository, reply }) => {
			const user = await repository.createUser(name, password)
			reply.code(201)
			reply.request.session.set('id', user.id)
			return { id: user.id }
		},
		login: async (root, { name, password }, { repository, reply }) => {
			const user = await repository.getUserByName(name)
			if (!user || user.password !== password) {
				throw new ErrorWithProps('Invalid credentials')
			} else {
				reply.request.session.set('id', user.id)
				return { id: user.id }
			}
		},
		logout: async (root, args, { reply }) => {
			reply.request.session.delete()
			return true
		},
		favorite: async (root, { songId, isFavorite }, { user, repository }) => {
			if (!user) throw new ErrorWithProps('Not logged in')
			await repository.favoriteSong(user.id, songId, isFavorite)
			return { id: songId }
		},
	},
	User: {
		name: async ({ id }, args, { repository }) => {
			const user = await repository.getUserById(id)
			return user.name
		},
		favorites: async ({ id }, args, { repository }) => repository.getFavoriteSongs(id),
	},
}
