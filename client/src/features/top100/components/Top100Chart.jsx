import { Chart } from '../../../components/chart/Chart'
import { useMyFavoriteIds } from '../hooks/useMyFavoriteIds'
import { useTop100 } from '../hooks/useTop100'

export const Top100Chart = () => {
	const songs = useTop100()
	const favoriteIds = useMyFavoriteIds()
	return (
		<Chart
			songs={songs}
			favoriteIds={favoriteIds}
		/>
	)
}
