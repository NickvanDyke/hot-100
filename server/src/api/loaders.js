export default (songPort) => ({
	Song: {
		title: (queries) => songPort.getTitles(queries.map(({ obj }) => obj.id)),
		artist: (queries) => songPort.getArtists(queries.map(({ obj }) => obj.id)),
		cover: (queries) => songPort.getCovers(queries.map(({ obj }) => obj.id)),
		rank: (queries) => songPort.getRanks(queries.map(({ obj }) => obj.id)),
		tag: (queries) => songPort.getTags(queries.map(({ obj }) => obj.id)),
	}
})