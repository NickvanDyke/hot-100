import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'

export const apollo = new ApolloClient({
	connectToDevTools: true,
	link: createHttpLink({
		uri: '/graphql',
		credentials: 'same-origin',
	}),
	cache: new InMemoryCache(),
	defaultOptions: {
		watchQuery: {
			fetchPolicy: 'cache-and-network',
		},
	},
})
