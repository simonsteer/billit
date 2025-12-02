import {
  MutationProcedure,
  QueryProcedure,
} from '@trpc/server/unstable-core-do-not-import'
import { trpcRouter } from '@/lib/trpc/router'

export type TRPCRouter = typeof trpcRouter

export type ProcedureName = Exclude<keyof TRPCRouter, '_def' | 'createCaller'>

export type ProcedureInput<T extends ProcedureName> =
  TRPCRouter[T] extends QueryProcedure<infer Config> ? Config['input'] : never

export type ProcedureOutput<T extends ProcedureName> =
  TRPCRouter[T] extends QueryProcedure<infer Config> ? Config['output'] : never
