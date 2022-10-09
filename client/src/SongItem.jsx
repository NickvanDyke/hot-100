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
import { useFavorite } from './hooks/useFavorite.js'

export const SongItem = ({
	song: { id, title, artist, cover, rank, isFavorite },
}) => {
	const favorite = useFavorite(id)

	return (
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
						{rank ? `#${rank}` : ''}
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
				<IconButton onClick={() => favorite(!isFavorite)}>
					{isFavorite ? <Favorite /> : <FavoriteBorder />}
				</IconButton>
			</ListItemSecondaryAction>
		</ListItem>
	)
}
