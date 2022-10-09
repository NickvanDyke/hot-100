import { useMutation } from '@apollo/client'
import { Signup } from '../gql/Signup.gql'
import { Login } from '../gql/Login.gql'
import { useCookies } from 'react-cookie'
import { Logout } from '../gql/Logout.gql'

export const useAuth = () => {
	const [cookies, setCookie, removeCookie] = useCookies(['name'])
	const [signup] = useMutation(Signup)
	const [login] = useMutation(Login)
	const [logout] = useMutation(Logout)

	return {
		name: cookies.name,
		signup: (name, password, cb) => {
			signup({
				variables: {
					name,
					password,
				},
				onCompleted: (data) => {
					setCookie('name', data.signup.name, { path: '/', expires: false })
					cb(data)
				},
				onError: (err) => cb(null, err.graphQLErrors[0].message),
			})
		},
		login: (name, password, cb) => {
			login({
				variables: {
					name,
					password,
				},
				onCompleted: (data) => {
					console.log(data)
					setCookie('name', data.login.name, { path: '/', expires: false })
					cb(data)
				},
				onError: (err) => cb(null, err.graphQLErrors[0].message),
			})
		},
		logout: () => {
			logout({
				onCompleted: () => {
					removeCookie('name')
				},
			})
		},
	}
}
