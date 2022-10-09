import Favorite from '@mui/icons-material/Favorite'
import FavoriteBorder from '@mui/icons-material/FavoriteBorder'
import { Box, Chip, Stack, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { Account } from './Account'
import { FavoritesChart } from './FavoritesChart'
import { useAuth } from './hooks/useAuth'
import { useOnTop } from './hooks/useOnTop'
import { Top100Chart } from './Top100Chart'

export const Page = () => {
	const auth = useAuth()
	const [viewingFavorites, setViewingFavorites] = useState(false)
	const { onTop, ref } = useOnTop()

	useEffect(() => {
		// kinda hacky but MVP
		if (!auth.name) setViewingFavorites(false)
	}, [auth.name])

	return (
		<Stack height='100%'>
			<Stack
				boxShadow={onTop ? 0 : 4}
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
				<Stack p={2}>
					<Account />
				</Stack>
			</Stack>
			<Box
				height='100%'
				overflow='scroll'
				ref={ref}>
				{auth.name && (
					<Chip
						sx={{ ml: 3, mt: 1 }}
						label='FAVORITES'
						icon={viewingFavorites ? <Favorite /> : <FavoriteBorder />}
						onClick={() => setViewingFavorites(!viewingFavorites)}
						color={viewingFavorites ? 'primary' : 'default'}
						variant={viewingFavorites ? 'filled' : 'outlined'}
					/>
				)}
				{viewingFavorites ? <FavoritesChart /> : <Top100Chart />}
			</Box>
		</Stack>
	)
}
