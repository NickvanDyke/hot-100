import { ApolloProvider } from '@apollo/client'
import { Top100Chart } from './Top100Chart'
import { apollo } from './lib/apollo.js'
import { Box, Stack, Typography } from '@mui/material'
import { Account } from './Account'

export const App = () => {
	return (
		<ApolloProvider client={apollo}>
			<Stack height='100%'>
				<Stack
					boxShadow={4}
					direction='row'
					justifyContent='space-between'>
					<Typography
						fontSize='min(10vw, 64px)'
						px={4}
						py={2}>
						Billboard Top 100
					</Typography>
					<Account />
				</Stack>
				<Box height='100%' overflow='scroll'>
					<Top100Chart />
				</Box>
			</Stack>
		</ApolloProvider>
	)
}
