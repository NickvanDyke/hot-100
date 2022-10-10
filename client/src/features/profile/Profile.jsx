import Favorite from '@mui/icons-material/Favorite'
import FavoriteBorder from '@mui/icons-material/FavoriteBorder'
import Logout from '@mui/icons-material/Logout'
import { Button, Chip, IconButton, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { AuthDialog } from '../../components/AuthDialog'
import { useAuth } from '../../hooks/useAuth'

export const Profile = ({ viewingFavorites, onViewFavorites }) => {
	const auth = useAuth()
	const [authing, setAuthing] = useState(undefined)

	return (
		<Stack
			justifyContent='space-between'
			alignItems='center'
			pl={3}
			pr={2}
			direction='row'>
			<Chip
				sx={{ my: 0.5 }}
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
					<Typography color='text.secondary'>Hi, {auth.name}!</Typography>
					<IconButton
						sx={{ p: 0 }}
						onClick={() => auth.logout(() => onViewFavorites(false))}>
						<Logout />
					</IconButton>
				</Stack>
			) : (
				<Button
					variant='outlined'
					onClick={() => setAuthing('')}>
					Signup / Login
				</Button>
			)}
			<AuthDialog
				isOpen={authing !== undefined}
				bonusTitle={authing}
				onClose={() => setAuthing(undefined)}
			/>
		</Stack>
	)
}