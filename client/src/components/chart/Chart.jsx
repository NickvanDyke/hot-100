import { List } from '@mui/material'
import { SongItem } from './SongItem'
import { SongItemSkeleton } from './SongItemSkeleton'

export const Chart = ({ songs, favoriteIds }) => {
	const items = songs
		? songs.map((song) => (
				<SongItem
					key={song.id}
					song={song}
					isFavorite={favoriteIds?.includes(song.id)}
				/>
		  ))
		: Array.from({ length: 100 }, (_, i) => (
				<SongItemSkeleton
					key={i}
					index={i}
				/>
		  ))

	return <List disablePadding>{items}</List>
}
