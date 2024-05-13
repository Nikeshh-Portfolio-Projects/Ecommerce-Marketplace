import type { AppRouter } from "@/app/(app)/api/trpc/index";
import { createTRPCReact } from "@trpc/react-query";

export const trpc = createTRPCReact<AppRouter>();
