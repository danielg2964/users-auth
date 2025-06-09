export const end : unique symbol
= Symbol ()

type End
= typeof end

type ResolveValue < T >
= T extends Promise < infer PR >
  ? PR
  : T

const valueAwaiter
= < T > (promise : Promise < T >) =>
  async < D extends (value : T) => unknown > (delegate : D) =>
  delegate (await promise)

type Delegate < T >
= (value : ResolveValue < T >) =>
  unknown

export type Pipe < T >
= < D extends Delegate < T > | End > (delegate : D) =>
  D extends End
  ? T
  : D extends (value : ResolveValue < T >) => infer R
    ? R extends Promise < unknown >
      ? Pipe < R >
      : T extends Promise < unknown >
        ? Pipe < Promise < R > >
        : Pipe < R >
    : never

export const pipe
= < T > (value : T) : Pipe < T > =>
  delegate => 
  delegate === end
  ? value as any
  : value instanceof Promise
    ? pipe (valueAwaiter (value) (delegate))
    : pipe (delegate (value as ResolveValue < T >))

