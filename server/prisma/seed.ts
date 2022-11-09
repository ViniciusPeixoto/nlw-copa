import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "Chick Hicks",
      email: "chick.hicks@katchuga.com",
      avatarUrl: "https://static.wikia.nocookie.net/pixar/images/7/71/Cars_chick_hicks.jpg",
    }
  })

  const pool = await prisma.pool.create({
    data:{
      title: "Example Pool",
      code: "BOLAO314",
      ownerId: user.id,
      participants: {
        create: {
          userId: user.id
        }
      }
    }
  })

  await prisma.game.create({
    data: {
      date: "2022-11-02T22:43:34.910Z",
      homeTeamCountryCode: "DE",
      visitorTeamCountryCode: "BR",
    }
  })

  await prisma.game.create({
    data: {
      date: "2022-11-03T22:43:34.910Z",
      homeTeamCountryCode: "BR",
      visitorTeamCountryCode: "AR",
      guesses: {
        create: {
          homeTeamPoints: 2,
          visitorTeamPoints: 1,
          participant: {
            connect: {
              userId_poolId: {
                userId: user.id,
                poolId: pool.id,
              }
            }
          }
        }
      }
    }
  })
}

main()