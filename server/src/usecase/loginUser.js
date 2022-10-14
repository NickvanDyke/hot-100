export default (userPort) => async (name, password) => {
	const user = await userPort.getByName(name)
	if (!user || user.password !== password) {
		throw new Error('Invalid credentials')
	}
	return user.id
}
