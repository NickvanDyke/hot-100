import Favorite from '@mui/icons-material/Favorite'
import FavoriteBorder from '@mui/icons-material/FavoriteBorder'
import Logout from '@mui/icons-material/Logout'
import { Button, Chip, IconButton, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { Auth } from './Auth'
import { useAuth } from './hooks/useAuth'

export const Header = ({ viewingFavorites, onViewFavorites }) => {
	const auth = useAuth()
	const [authing, setAuthing] = useState(undefined)

	return (
		<Stack
			justifyContent='space-between'
			alignItems='center'
			pt={1}
			pl={3}
			pr={2}
			direction='row'>
			<Chip
				label='FAVORITES'
				icon={viewingFavorites ? <Favorite /> : <FavoriteBorder />}
				onClick={() => {
					if (auth.name) onViewFavorites(!viewingFavorites)
					else setAuthing(' to view favorites')
				}}
				color={viewingFavorites ? 'primary' : 'default'}
				variant={viewingFavorites ? 'filled' : 'outlined'}
			/>
			{auth.name ? (
				<Stack
					direction='row'
					gap={1}>
					<Typography color='text.secondary'>Welcome, {auth.name}</Typography>
					<IconButton
						sx={{ p: 0 }}
						onClick={() => auth.logout(() => onViewFavorites(false))}>
						<Logout />
					</IconButton>
				</Stack>
			) : (
				<Button
					variant='outlined'
					onClick={() => setAuthing(true)}>
					Signup/Login
				</Button>
			)}
			<Auth
				isOpen={authing !== undefined}
				bonusTitle={authing}
				onClose={() => setAuthing(undefined)}
			/>
		</Stack>
	)
}
