import FavoriteBorder from '@mui/icons-material/FavoriteBorder'
import {
	IconButton,
	ListItem,
	ListItemAvatar,
	ListItemButton,
	ListItemSecondaryAction,
	ListItemText,
	Skeleton,
	Stack,
	Typography,
} from '@mui/material'

export const SongItemSkeleton = ({ index }) => {
	return (
		<ListItem
			divider={true}
			disableGutters>
			<ListItemButton>
				<ListItemAvatar>
					<Stack
						direction='row'
						alignItems='center'
						gap={2}
						pr={2}>
						<Typography
							minWidth={'2.25em'}
							textAlign='end'>
							#{index + 1}
						</Typography>
						<Skeleton
							variant='rectangular'
							width='50px'
							height='50px'
						/>
					</Stack>
				</ListItemAvatar>
				<ListItemText
					primary={<Skeleton width='min(80%, 200px)' />}
					secondary={<Skeleton width='min(60%, 150px)' />}
				/>
				<ListItemSecondaryAction>
					<IconButton>
						<FavoriteBorder />
					</IconButton>
				</ListItemSecondaryAction>
			</ListItemButton>
		</ListItem>
	)
}
