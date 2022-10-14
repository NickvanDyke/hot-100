export default (favoritePort) => async (userId, songId) => {
	if (!userId) throw new Error('Not logged in')
	await favoritePort.unfavorite(userId, songId)
}
