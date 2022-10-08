export default {
	Song: {
		title: (queries, { repository }) => repository.getSongTitles(queries.map(({ obj }) => obj.id)),
		artist: (queries, { repository }) => repository.getSongArtists(queries.map(({ obj }) => obj.id)),
		cover: (queries, { repository }) => repository.getSongCovers(queries.map(({ obj }) => obj.id)),
		// TODO pass week and year to this somehow
		rank: (queries, { repository }) => repository.getSongRanks(queries.map(({ obj }) => obj.id)),
		tag: (queries, { repository }) => repository.getSongTags(queries.map(({ obj }) => obj.id)),
		isFavorite: async (queries, { repository, user }) => {
			if (!user) return false
			const favoriteIds = (await repository.getFavoriteSongs(user.id)).map((song) => song.id)
			return queries.map(({ obj }) => favoriteIds.includes(obj.id))
		}
	}
}