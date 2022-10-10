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
			gap={1}>
			{auth.name ? (
				<Stack
					direction='row'
					gap={1}>
					<Typography color='text.secondary'>Hi, {auth.name}!</Typography>
					<IconButton
						aria-label='logout'
						sx={{ p: 0 }}
						onClick={() => auth.logout(() => onViewFavorites(false))}>
						<Logout />
					</IconButton>
				</Stack>
			) : (
				<Button
					aria-label='Signup or Login'
					variant='contained'
					onClick={() => setAuthing('')}>
					Signup / Login
				</Button>
			)}
			{auth.name && (
				<Chip
					sx={{ my: 0.5 }}
					label='FAVORITES'
					icon={viewingFavorites ? <Favorite /> : <FavoriteBorder />}
					onClick={() => onViewFavorites(!viewingFavorites)}
					color={viewingFavorites ? 'primary' : 'default'}
					variant={viewingFavorites ? 'filled' : 'outlined'}
				/>
			)}
			<AuthDialog
				isOpen={authing !== undefined}
				bonusTitle={authing}
				onClose={() => setAuthing(undefined)}
			/>
		</Stack>
	)
}
