import { ApolloProvider } from '@apollo/client'
import { Top100 } from './Top100'
import { apollo } from './lib/apollo.js'

export const App = () => {
	return (
		<ApolloProvider client={apollo}>
			<Top100 />
		</ApolloProvider>
	)
}
