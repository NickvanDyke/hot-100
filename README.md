# Technical design

## The stack
Backend:
- NodeJS
- Fastify
- Mercurius GraphQL server - extremely performant
- PostgresQL
- JavaScript (for the PoC at least; easy to be fast and loose when prototyping, but on a long-term project with multiple developers, TypeScript pays dividends quickly)

Frontend:
- React
- JavaScript
- Apollo Client

Why:
- Using JavaScript/TypeScript on both the front and back end makes it easy for developers to work on both sides of the application, requiring familiarity with only one language.
- Popularity
	- Easier to find developers with experience
	- More resources available online
	- Repeatedly battle-tested in the real world
	
## Database model
See the [schema](./server/sql/migrations/1_create-initial-schema.sql).

## Method for accessing data
The server exposes a GraphQL API for the client to consume - see the [schema](./server/gql/schema.gql). Realistically for such a small and simple project, REST might be more appropriate. But in a real-world scenario, where before you know it you're being asking to push the prototype to production and add features too quickly to allow time for shoring up the foundation, the extensibility of starting with GraphQL can quickly make it worth the slightly extra initial effort. 

## Front-end architecture

## Testing strategy
The system is tested primarily on behavior. That is, tests interact with the system as a consumer would, and assert that the 'black box' behaves as expected. For example, when the client uses the API to favorite a song and then requests the user's favorites, it'd expect that song to be there.

This has a few advantages:
- Resilient to implementation changes
- Tests serve as documentation of how the system should behave
- Forces you to think about and cover edge cases
- Easy to map user stories to test cases and write them first, since test code usually doesn't depend on code that doesn't exist yet. e.g. not a problem to hit an endpoint that doesn't exist yet
- Minimizes time spent mocking, stubbing, spying etc and most closely mimicks the real world
- Bang for your buck - you can cover a lot of ground with a relatively small number of tests
	- However this comes with a tradeoff of reduced granularity, where you may have to do a little more hunting when a test fails to figure out exactly where/why

Unit testing still has its place of course, but this application doesn't involve any complex logic/algorithms that warrant testing in isolation with extensive inputs and expected outputs.

## Assumptions
- The user wants to access their favorites across devices, i.e. a login is needed. As opposed to simply using e.g. cookies or LocalStorage.

# Proof of concept
In this repository, you'll find the source for a proof of concept. I often find that actually building out an idea requires you to think more critically, and helps catch intricacies that you may miss when purely drawing it up. I particularly find it facilitates an ergonomic API, as it forces you to stumble on and confront pain points in your model and how it's consumed.

## What's missing
Important points that are missing from the PoC for the sake of brevity, but would be relatively vital before production-readiness:
- Salting + hashing passwords
- Email signup + verification, password reset
- Elegant error responses from API
- Stringent password requirements

## Neat nice to haves
Cool or fun features often pop up while prototyping. But of course, we only have so much time and must prioritize. Here are some for posterity:
- Store favorites locally if user is not logged in, so they can favorite without an account; then sync with server when they log in/sign up
- View number of favorites each song has
- View past weeks
- Social login
- With enough historical data stored, show a graph of song(s) performance over time