import { ApolloProvider } from '@apollo/client'
import { Top100Chart } from './Top100Chart'
import { apollo } from './lib/apollo.js'
import { Box, Stack, Typography } from '@mui/material'
import { Account } from './Account'
import { useEffect, useRef, useState } from 'react'

export const App = () => {
	const [onTop, setOnTop] = useState(true)
	const listRef = useRef()
	useEffect(() => {
		if (!listRef) return
		const cb = () => setOnTop(listRef.current.scrollTop === 0)
		listRef.current.addEventListener('scroll', cb)
		return () => {
			listRef.current?.removeEventListener('scroll', cb)
		}
	}, [setOnTop, listRef])

	return (
		<ApolloProvider client={apollo}>
			<Stack height='100%'>
				<Stack
					boxShadow={onTop ? 0 : 4}
					sx={{ transition: 'box-shadow 0.3s' }}
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
				<Box
					height='100%'
					overflow='scroll'
					ref={listRef}>
					<Top100Chart />
				</Box>
			</Stack>
		</ApolloProvider>
	)
}
