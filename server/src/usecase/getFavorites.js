export default (favoritePort) => async (userId) => {
	if (!userId) throw new Error('Not logged in')
	return favoritePort.getFavoriteSongIds(userId)
}