export default (songPort) => (ids, fields) => {
	return songPort.get(ids, fields)
}