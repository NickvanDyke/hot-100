import Favorite from '@mui/icons-material/Favorite'
import FavoriteBorder from '@mui/icons-material/FavoriteBorder'
import {
	IconButton,
	ListItem,
	ListItemAvatar,
	ListItemSecondaryAction,
	ListItemText,
	Stack,
	Typography,
} from '@mui/material'
import { useState } from 'react'
import { Auth } from './Auth.jsx'
import { useAuth } from './hooks/useAuth.js'
import { useFavorite } from './hooks/useFavorite.js'

export const SongItem = ({
	song: { id, title, artist, cover, rank, isFavorite },
}) => {
	const favorite = useFavorite(id)
	const [authing, setAuthing] = useState(false)
	const auth = useAuth()

	const onFavorite = () => {
		if (!auth.name) {
			setAuthing(true)
		} else {
			favorite(!isFavorite)
		}
	}

	return (
		<div>
			<Auth
				onClose={() => setAuthing(false)}
				onAuthed={() => favorite(true)}
				isOpen={authing}
			/>
			<ListItem>
				<ListItemAvatar>
					<Stack
						direction='row'
						alignItems='center'
						gap={2}
						pr={2}>
						<Typography
							minWidth={'2.25em'}
							textAlign='end'>
							{rank ? `#${rank}` : '-'}
						</Typography>
						<img
							height='50px'
							src={cover}
							alt={title}
						/>
					</Stack>
				</ListItemAvatar>
				<ListItemText
					primary={title}
					secondary={artist}
				/>
				<ListItemSecondaryAction>
					<IconButton onClick={() => onFavorite()}>
						{isFavorite ? <Favorite /> : <FavoriteBorder />}
					</IconButton>
				</ListItemSecondaryAction>
			</ListItem>
		</div>
	)
}
