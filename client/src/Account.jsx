import Person from '@mui/icons-material/AccountCircle'
import Logout from '@mui/icons-material/Logout'
import { IconButton, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { Auth } from './Auth'
import { useAuth } from './hooks/useAuth'

export const Account = () => {
	const [authing, setAuthing] = useState(false)
	const auth = useAuth()

	return (
		<Stack
			gap={0}
			spacing={0}
			justifyContent='center'
			alignItems='center'>
			<IconButton
				sx={{ p: 0 }}
				onClick={() => {
					if (!auth.name) setAuthing(true)
				}}>
				<Person sx={{ width: '48px', height: '48px' }} />
			</IconButton>
			{auth.name && (
				<Stack
					alignItems='center'
					gap={1}
					direction='row'>
					<Typography
						color='text.secondary'
						textAlign='start'>
						{auth.name}
					</Typography>
					<IconButton
						sx={{ p: 0 }}
						onClick={() => auth.logout()}>
						<Logout />
					</IconButton>
				</Stack>
			)}
			<Auth
				isOpen={authing}
				onClose={() => setAuthing(false)}
			/>
		</Stack>
	)
}
