import cors from '@fastify/cors'
import fastifyPostgres from '@fastify/postgres'
import fastifySecureSession from '@fastify/secure-session'
import fastifyStatic from '@fastify/static'
import dotenv from 'dotenv'
import { fastify as fastifyInstantiate } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import fs from 'fs'
import path from 'path'
import { migrate } from 'postgres-migrations'
import graphql from './api/graphql.js'
import favoriteAdapter from './adapter/favoriteAdapter.js'
import songAdapter from './adapter/songAdapter.js'
import userAdapter from './adapter/userAdapter.js'
import billboardAdapter from './adapter/billboardAdapter.js'
import signupUser from './usecase/signupUser.js'
import loginUser from './usecase/loginUser.js'
import favoriteSong from './usecase/favoriteSong.js'
import unfavoriteSong from './usecase/unfavoriteSong.js'
import getTop100Songs from './usecase/getTop100Songs.js'
import getFavorites from './usecase/getFavorites.js'
dotenv.config({ path: path.resolve(process.cwd(), '..', '.env') })

export default async function build(options = {}) {
	const fastify = fastifyInstantiate(options)
	fastify.register(import('@fastify/compress'))

	fastify.register(fastifyStatic, {
		root: path.join(process.cwd(), '..', 'client', 'dist'),
	})
	fastify.setNotFoundHandler((req, res) => res.redirect('/'))

	fastify.register(cors, {
		origin: ['http://localhost:3000'],
		credentials: true,
	})
	fastify.register(fastifySecureSession, {
		key: Buffer.from(process.env.COOKIE_KEY, 'hex'),
		cookie: {
			path: '/',
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
		},
	})
	await fastify.register(fastifyPostgres, {
		connectionString: options.pgConnectionString,
	})
	let client
	try {
		client = await fastify.pg.connect()
		await migrate({ client }, './sql/migrations')
	} catch (err) {
		console.error(err)
		if (options.forceMigration) {
			console.log('Forcing migration...')
			await fastify.pg.query(fs.readFileSync('./sql/recreate_schema.psql').toString())
			await migrate({ client }, './sql/migrations')
		}
	} finally {
		await client?.end()
	}

	const query = (path, args) =>
		fastify.pg.query(fs.readFileSync('./sql/' + path + '.psql').toString(), args).then((res) => res.rows)

	const songs = songAdapter(query)
	const users = userAdapter(query)
	const favorites = favoriteAdapter(query)
	const billboard = billboardAdapter()

	fastify.register(fastifyPlugin(graphql), {
		songAdapter: songs,
		services: {
			signupUser: signupUser(users),
			loginUser: loginUser(users),
			favoriteSong: favoriteSong(favorites),
			unfavoriteSong: unfavoriteSong(favorites),
			getFavorites: getFavorites(favorites),
			getTop100Songs: getTop100Songs(songs, billboard),
		},
	})

	fastify.get('/healthz', async (request, reply) => {
		reply.send()
	})

	return fastify
}
