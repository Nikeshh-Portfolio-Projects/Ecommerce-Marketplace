import { z } from 'zod';
import { publicProcedure, router } from './trpc';

export const appRouter = router({
  hello: publicProcedure.query(async () => {
    return {
      greeting: `hello`,
    };    
  })
});

// export type definition of API
export type AppRouter = typeof appRouter;