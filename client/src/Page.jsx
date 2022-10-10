import { Box, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { FavoritesChart } from './FavoritesChart'
import { Header } from './Header'
import { useAtTop } from './hooks/useAtTop'
import { Top100Chart } from './Top100Chart'

export const Page = () => {
	const [viewingFavorites, setViewingFavorites] = useState(false)
	const { atTop, ref } = useAtTop()

	return (
		<Stack height='100%'>
			<Box
				boxShadow={atTop ? 0 : 4}
				sx={{ transition: 'box-shadow 0.3s' }}
				direction='row'
				alignItems='center'
				justifyContent='space-between'>
				<Typography
					fontSize='min(10vw, 64px)'
					px={4}
					py={2}>
					Billboard Top 100
				</Typography>
			</Box>
			<Stack
				height='100%'
				overflow='scroll'
				ref={ref}>
				<Header
					viewingFavorites={viewingFavorites}
					onViewFavorites={(view) => setViewingFavorites(view)}
				/>
				{viewingFavorites ? <FavoritesChart /> : <Top100Chart />}
			</Stack>
		</Stack>
	)
}
