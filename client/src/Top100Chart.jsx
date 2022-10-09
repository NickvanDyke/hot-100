import { List } from '@mui/material'
import { useTop100 } from './hooks/useTop100'
import { SongItem } from './SongItem'
import { SongItemSkeleton } from './SongItemSkeleton'

export const Top100Chart = () => {
	const songs = useTop100()

	if (!songs) {
		return (
			<List>
				{Array.from({ length: 100 }, (_, i) => (
					<SongItemSkeleton
						key={i}
						index={i}
					/>
				))}
			</List>
		)
	}

	return (
		<List>
			{songs.map((song) => (
				<SongItem
					key={song.id}
					song={song}
				/>
			))}
		</List>
	)
}
