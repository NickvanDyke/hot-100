export const gql = String.raw

export const auth = async (fastify, gql, name, password) => {
	const res = await fastify.inject({
		method: 'POST',
		url: '/graphql',
		headers: {
			'content-type': 'application/json',
		},
		payload: JSON.stringify({
			query: `
				mutation {
					login(name: "${name}", password: "${password}") {
						name
					}
				}
			`,
		}),
	})

	gql.setCookies({ session: res.cookies[0].value })
}
