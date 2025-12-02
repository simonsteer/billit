import {
  MutationProcedure,
  QueryProcedure,
} from '@trpc/server/unstable-core-do-not-import'
import { trpcRouter } from '@/lib/trpc/router'

export type TRPCRouter = typeof trpcRouter

export type ProcedureInput<T extends keyof TRPCRouter> =
  TRPCRouter[T] extends QueryProcedure<infer Config> ? Config['input'] : never

export type ProcedureOutput<T extends keyof TRPCRouter> =
  TRPCRouter[T] extends QueryProcedure<infer Config> ? Config['output'] : never
