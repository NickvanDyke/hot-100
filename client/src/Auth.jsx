import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Stack,
	TextField,
	Typography,
} from '@mui/material'
import { useState } from 'react'
import { useAuth } from './hooks/useAuth'

export const Auth = ({ isOpen, onClose, onAuthed, bonusTitle }) => {
	const [name, setName] = useState('')
	const [password, setPassword] = useState('')
	const [err, setErr] = useState()
	const auth = useAuth()

	const onClosed = () => {
		onClose()
		setName('')
		setPassword('')
		setErr('')
	}

	const submit = (isNew) => {
		const cb = (data, err) => {
			if (!err) {
				onAuthed?.()
				onClosed()
			} else {
				setErr(err)
			}
		}
		if (isNew) {
			auth.signup(name, password, cb)
		} else {
			auth.login(name, password, cb)
		}
	}

	return (
		<Dialog
			open={isOpen}
			onClose={onClosed}>
			<DialogTitle>
				Sign up or Login{bonusTitle}
			</DialogTitle>
			<DialogContent>
				<Stack gap={2}>
					<TextField
						placeholder='Name'
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<TextField
						placeholder='Password'
						value={password}
						helperText={'Must be at least 8 characters'}
						type='password'
						onChange={(e) => setPassword(e.target.value)}
					/>
					{err && <Typography color='error'>{err}</Typography>}
				</Stack>
			</DialogContent>
			<DialogActions>
				<Button
					onClick={() => submit(true)}
					disabled={
						name.length === 0 || name.length > 20 || password.length < 8
					}>
					Sign up
				</Button>
				<Button
					onClick={() => submit(false)}
					disabled={
						name.length === 0 || name.length > 20 || password.length < 8
					}>
					Login
				</Button>
			</DialogActions>
		</Dialog>
	)
}
