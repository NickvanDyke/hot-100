export default (date) => {
	let d = new Date(date)
	d.setDate(d.getUTCDate() - d.getUTCDay())
	return d
}
