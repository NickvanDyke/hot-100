import { Box, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { FavoritesChart } from './features/favorites/components/FavoritesChart'
import { Profile } from './features/profile/Profile'
import { useAtTop } from './hooks/useAtTop'
import { Top100Chart } from './features/top100/components/Top100Chart'

export const Page = () => {
	const [viewingFavorites, setViewingFavorites] = useState(false)
	const { atTop, ref } = useAtTop()

	return (
		<Stack height='100%'>
			<Stack
				direction='row'
				boxShadow={atTop ? 0 : 4}
				sx={{ transition: 'box-shadow 0.3s' }}
				alignItems='center'
				px={4}
				py={2}
				gap={2}
				justifyContent='space-between'>
				<Typography fontSize='min(8vw, 4rem)'>Billboard Top&nbsp;100</Typography>
				<Profile
					viewingFavorites={viewingFavorites}
					onViewFavorites={(view) => setViewingFavorites(view)}
				/>
			</Stack>
			<Box
				height='100%'
				overflow='scroll'
				ref={ref}>
				{viewingFavorites ? <FavoritesChart /> : <Top100Chart />}
			</Box>
		</Stack>
	)
}
