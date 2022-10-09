import { Button, IconButton, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { Auth } from './Auth'
import { useAuth } from './hooks/useAuth'
import Person from '@mui/icons-material/AccountCircle'

export const Account = () => {
	const [authing, setAuthing] = useState()
	const auth = useAuth()

	return (
		<Stack
			direction='row'
			p={3}
			justifyContent='center'
			alignItems='flex-start'>
			<IconButton
				onClick={() => {
					if (!auth.name) setAuthing(true)
				}}>
				<Person sx={{ width: '48px', height: '48px' }} />
			</IconButton>
			{auth.name && (
				<Stack>
					<Typography
						variant='h6'
						textAlign='start'>
						{auth.name}
					</Typography>
					<Button
						sx={{ p: 0 }}
						onClick={() => auth.logout()}>
						Logout
					</Button>
				</Stack>
			)}
			<Auth
				isOpen={authing}
				onClose={() => setAuthing(false)}
			/>
		</Stack>
	)
}
