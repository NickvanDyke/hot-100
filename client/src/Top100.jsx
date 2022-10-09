import { useTop100 } from './hooks/useTop100'
import { Box, List } from '@mui/material'
import { SongItem } from './SongItem'

export const Top100 = () => {
	const { songs, loading } = useTop100()

	if (loading) return null

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
