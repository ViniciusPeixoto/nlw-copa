import { FastifyInstance } from "fastify"
import { z } from "zod"

import { prisma } from '../lib/prisma'
import { authenticate } from "../plugins/authenticate"

export async function guessRoutes(fastify: FastifyInstance) {
  fastify.get('/guesses/count', async () => {
    const guessesCount = await prisma.guess.count()

    return {
      guessesCount
    }
  })

  fastify.post('/pools/:poolId/games/:gameId/guesses', {
    onRequest: [authenticate]
  }, async (request, reply) => {
    const createGuessParams = z.object({
      poolId: z.string(),
      gameId: z.string(),
    })

    const createGuessBody = z.object({
      homeTeamPoints: z.number(),
      visitorTeamPoints: z.number(),
    })

    const { poolId, gameId } = createGuessParams.parse(request.params)
    const { homeTeamPoints, visitorTeamPoints } = createGuessBody.parse(request.body)

    const participant = await prisma.participant.findUnique({
      where: {
        userId_poolId: {
          poolId,
          userId: request.user.sub
        }
      }
    })

    if (!participant) {
      return reply.status(403).send({
        message: 'Participant did not join this pool!'
      })
    }

    const guess = await prisma.guess.findUnique({
      where: {
        participantId_gameId: {
          participantId: participant.id,
          gameId,
        }
      }
    })

    if (guess) {
      return reply.status(409).send({
        message: 'Already sent a guess on this pool!'
      })
    }

    const game = await prisma.game.findUnique({
      where: {
        id: gameId
      }
    })

    if (!game) {
      return reply.status(404).send({
        message: 'Game not found!'
      })
    }

    // if (game.date < new Date()) {
    //   return reply.status(403).send({
    //     message: 'Cannot send guess after the game started!'
    //   })
    // }

    await prisma.guess.create({
      data: {
        gameId,
        participantId: participant.id,
        homeTeamPoints,
        visitorTeamPoints
      }
    })

    return reply.status(201).send()
  })
}