import hasBillboardUpdatedSince from '../util/hasBillboardUpdatedSince.js'

export default (songPort, billboardPort) => async () => {
	const lastUpdated = await songPort.getLastUpdated()
	if (!lastUpdated || hasBillboardUpdatedSince(lastUpdated)) {
		const latest = await billboardPort.getLatestTop100()
		const now = new Date()
		await songPort.resetRanks()
		await Promise.all(
			latest.map(
				async ({ title, artist, cover, rank }) => await songPort.createOrUpdate(title, artist, cover, rank, now)
			)
		)
	}
	return songPort.getTop100Ids()
}
