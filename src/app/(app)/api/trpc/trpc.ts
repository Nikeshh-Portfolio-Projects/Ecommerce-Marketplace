import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { User } from "@/payload-types";

const t = initTRPC.create({
  transformer: superjson,
});

const middleware = t.middleware;

const isAuth = middleware(async ({ ctx, next }) => {
  const req = (ctx as any).req;

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

// Check the following commits after implementing payload
// https://github.com/Nikeshh/Ecommerce-Marketplace/commit/1425b46140e7d5e6d6d9c88c7d1bbb7c1e28ccfe
// https://github.com/Nikeshh/Ecommerce-Marketplace/commit/9db02b941ebb9771228a149973f1d66c3e13d6a4