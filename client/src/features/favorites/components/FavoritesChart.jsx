import { Chart } from '../../../components/chart/Chart'
import { useMyFavorites } from '../hooks/useMyFavorites'

export const FavoritesChart = () => {
	const favorites = useMyFavorites()
	return (
		<Chart
			songs={favorites.sort((a, b) => a.rank - b.rank)}
			favoriteIds={favorites?.map((song) => song.id)}
		/>
	)
}
