import { ApolloProvider } from '@apollo/client'
import { apollo } from './lib/apollo.js'
import { Page } from './Page'

export const App = () => {
	return (
		<ApolloProvider client={apollo}>
			<Page />
		</ApolloProvider>
	)
}
