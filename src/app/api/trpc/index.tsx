import { z } from 'zod'
import { authRouter } from './auth-router'
import { QueryValidator } from '@/lib/validators/query-validator'
import { getPayloadClient } from '../../../get-payload'
import { paymentRouter } from './payment-router'
import { publicProcedure, router } from './trpc'

export const appRouter = router({
  auth: authRouter,
  payment: paymentRouter,

  getInfiniteProducts: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100),
        cursor: z.number().nullish(),
        query: QueryValidator,
      })
    )
    .query(async ({ input }) => {
      const { query, cursor } = input
      const { sort, limit, ...queryOpts } = query

      const payload = await getPayloadClient()

      const parsedQueryOpts: Record<
        string,
        { equals: string }
      > = {}

      Object.entries(queryOpts).forEach(([key, value]) => {
        parsedQueryOpts[key] = {
          equals: value,
        }
      })

      const page = cursor || 1

      const {
        docs: items,
        hasNextPage,
        nextPage,
      } = await payload.find({
        collection: 'products',
        where: {
          approvedForSale: {
            equals: 'approved',
          },
          ...parsedQueryOpts,
        },
        sort,
        depth: 1,
        limit,
        page,
      })

      return {
        items,
        nextPage: hasNextPage ? nextPage : null,
      }
    }),
    getUsers: publicProcedure.query(({ ctx }) => {
      return userList;
    }),
})

export type AppRouter = typeof appRouter

// The code below is kept here to keep things simple

interface UserType {
  id: string;
  name: string;
  email: string;
}

const userList: UserType[] = [
  {
    id: "1",
    name: "John Doe",
    email: "johndoe@gmail.com",
  },
  {
    id: "2",
    name: "Abraham Smith",
    email: "abrahamsmith@gmail.com",
  },
  {
    id: "3",
    name: "Barbie Tracy",
    email: "barbietracy@gmail.com",
  },
  {
    id: "4",
    name: "John Payday",
    email: "johnpayday@gmail.com",
  },
  {
    id: "5",
    name: "Remember My Name",
    email: "remembermyname@gmail.com",
  },
  {
    id: "6",
    name: "Go to School",
    email: "gotoschool@gmail.com",
  },
  {
    id: "7",
    name: "Fish Fruit",
    email: "fishfruit@gmail.com",
  },
  {
    id: "8",
    name: "Don't try",
    email: "donttry@gmail.com",
  },
  {
    id: "9",
    name: "Producer Feed",
    email: "producerfeed@gmail.com",
  },
  {
    id: "10",
    name: "Panic So",
    email: "panicso@gmail.com",
  },
];
