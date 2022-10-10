import { List } from '@mui/material'
import { SongItem } from './SongItem'
import { SongItemSkeleton } from './SongItemSkeleton'

export const Chart = ({ songs }) => {
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
