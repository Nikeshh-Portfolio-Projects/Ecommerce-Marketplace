import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { User } from "@/payload-types";
import { PayloadRequest } from "payload/types";

const t = initTRPC.create({
  transformer: superjson,
});

const middleware = t.middleware;

const isAuth = middleware(async ({ ctx, next }) => {
  const req = (ctx as any).req as PayloadRequest;

  const { user } = req as { user: User | null };

  if (!user || !user.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      user,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth);
