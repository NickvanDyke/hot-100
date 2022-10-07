import cors from '@fastify/cors'
import fastifyPostgres from '@fastify/postgres'
import fastifySecureSession from '@fastify/secure-session'
import fastifyStatic from '@fastify/static'
import dotenv from 'dotenv'
import path from 'path'
import { fastify as fastifyInstantiate } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import fs from 'fs'
import { migrate } from 'postgres-migrations'
import graphql from './gql/graphql.js'
import repository from './repository.js'
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
			await fastify.pg.query(
				fs.readFileSync('./sql/recreate_schema.psql').toString()
			)
			await migrate({ client }, './sql/migrations')
		}
	} finally {
		await client?.end()
	}

	await fastify.register(
		fastifyPlugin(async (fastify) => {
			fastify.decorate('db', {
				q: (path, args) =>
					fastify.pg
						.query(fs.readFileSync('./sql/' + path + '.psql').toString(), args)
						.then((res) => res.rows),
			})
			fastify.decorate(
				'repository',
				repository(fastify)
			)
		})
	)

	fastify.register(fastifyPlugin(graphql), {
		pgConnectionString: options.pgConnectionString,
	})

	fastify.get('/healthz', async (request, reply) => {
		reply.send()
	})

	return fastify
}
