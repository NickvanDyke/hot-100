import Favorite from '@mui/icons-material/Favorite'
import FavoriteBorder from '@mui/icons-material/FavoriteBorder'
import {
	IconButton,
	ListItem,
	ListItemAvatar,
	ListItemButton,
	ListItemText,
	Skeleton,
	Stack,
	Typography,
} from '@mui/material'
import { useState } from 'react'
import { AuthDialog } from '../AuthDialog.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import { useFavorite } from '../../hooks/useFavorite.js'
import { useUnfavorite } from '../../hooks/useUnfavorite.js'

export const SongItem = ({ song: { id, title, artist, cover, rank }, isFavorite }) => {
	const favorite = useFavorite(id)
	const unfavorite = useUnfavorite(id)
	const [authing, setAuthing] = useState(false)
	const auth = useAuth()
	const [imgLoaded, setImgLoaded] = useState(false)

	const onFavorite = () => {
		if (!auth.name) {
			setAuthing(true)
		} else if (isFavorite) {
			unfavorite()
		} else {
			favorite()
		}
	}

	const onClick = () => {
		const query = encodeURIComponent(`${title} by ${artist}`)
		window.open('https://youtube.com/results?search_query=' + query, '_blank').focus()
	}

	return (
		<ListItem
			divider={true}
			disableGutters>
			<ListItemButton
				aria-label='View song'
				onClick={onClick}>
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
						{!imgLoaded && (
							<Skeleton
								variant='rectangular'
								width='50px'
								height='50px'
							/>
						)}
						<img
							height='50px'
							src={cover}
							alt={title}
							style={{ display: imgLoaded ? 'block' : 'none' }}
							onLoad={() => setImgLoaded(true)}
						/>
					</Stack>
				</ListItemAvatar>
				<ListItemText
					primary={title}
					secondary={artist}
				/>
				<IconButton
					aria-label='favorite'
					onClick={(e) => {
						e.stopPropagation()
						onFavorite()
					}}
					color={isFavorite ? 'primary' : undefined}>
					{isFavorite ? <Favorite /> : <FavoriteBorder />}
				</IconButton>
			</ListItemButton>
			<AuthDialog
				onClose={() => setAuthing(false)}
				onAuthed={() => favorite(true)}
				bonusTitle=' to favorite'
				isOpen={authing}
			/>
		</ListItem>
	)
}
