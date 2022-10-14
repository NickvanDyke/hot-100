export default ({ getFavorites, getTop100Songs, signupUser, loginUser, favoriteSong, unfavoriteSong }) => ({
	Query: {
		top100: async (root, args, context) => {
			const top100Ids = await getTop100Songs()
			return top100Ids.map((id) => ({ id }))
		},
		myFavorites: async (root, args, { user }) => {
			const myFavoriteIds = await getFavorites(user?.id)
			return myFavoriteIds.map((id) => ({ id }))
		},
	},
	Mutation: {
		signup: async (root, { name, password }, { reply }) => {
			const newUserId = await signupUser(name, password)
			reply.code(201)
			reply.request.session.set('id', newUserId)
			return name
		},
		login: async (root, { name, password }, { reply }) => {
			const userId = await loginUser(name, password)
			reply.request.session.set('id', userId)
			return name
		},
		logout: async (root, args, { reply }) => {
			reply.request.session.delete()
			return true
		},
		favorite: async (root, { songId }, { user }) => {
			await favoriteSong(user?.id, songId)
			return { id: songId }
		},
		unfavorite: async (root, { songId }, { user }) => {
			await unfavoriteSong(user?.id, songId)
			return { id: songId }
		},
	},
})
