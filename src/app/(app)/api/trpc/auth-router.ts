import { AuthCredentialsValidator } from '@/lib/validators/account-credentials-validator'
import { publicProcedure, router } from './trpc'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { PrimaryActionEmailHtml } from '@/components/emails/PrimaryActionEmail'

const generateEmailHTML = ({ token } : { token: string}) => {
  return PrimaryActionEmailHtml({
    actionLabel: "verify your account",
    buttonText: "Verify Account",
    href: `${process.env.NEXT_PUBLIC_SERVER_URL}/verify-email?token=${token}`
  })
}

export const authRouter = router({
  createPayloadUser: publicProcedure
    .input(AuthCredentialsValidator)
    .mutation(async ({ input }) => {
      const { email, password } = input
      const payload = await getPayload({
        config: configPromise,
      })

      // check if user already exists
      const { docs: users } = await payload.find({
        collection: 'users',
        where: {
          email: {
            equals: email,
          },
        },
      })

      if (users.length !== 0)
        throw new TRPCError({ code: 'CONFLICT' })

      await payload.create({
        collection: 'users',
        data: {
          email,
          password,
          role: 'user'
        },
      });

      payload.sendEmail({
        to: email,
        from: 'admin@nikeshh.com',
        subject: 'Thanks for signing up!',
        html: await generateEmailHTML({
          token: "ecommerce-marketplace"
        }),
      })

      return { success: true, sentToEmail: email }
    }),

  verifyEmail: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const { token } = input

      const payload = await getPayload({
        config: configPromise,
      })

      const isVerified = await payload.verifyEmail({
        collection: 'users',
        token,
      })

      if (!isVerified)
        throw new TRPCError({ code: 'UNAUTHORIZED' })

      return { success: true }
    }),

  signIn: publicProcedure
    .input(AuthCredentialsValidator)
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input

      const payload = await getPayload({
        config: configPromise,
      })

      try {
        await payload.login({
          collection: 'users',
          data: {
            email,
            password,
          },
        })

        return { success: true }
      } catch (err) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }
    }),
})
