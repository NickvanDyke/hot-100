export default (userPort) => async (name, password) => {
	const newUserId = await userPort.create(name, password)
	return newUserId
}
