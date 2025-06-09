import { isNothing, Just, Nothing, type Maybe } from '#types/maybe.ts'

export const otherwise : unique symbol
= Symbol ()

type Otherwise
= typeof otherwise

type LastDelegateCollector < T, R = never>
= < V, D extends (value : T) => unknown > (delegate : V | D) =>
  typeof delegate extends D
  ? D extends (value : T) => infer RA
    ? RA | R
    : never
  : V extends (value : infer TInV) => infer RA
    ? TInV extends T
      ? RA | R
      : never
  : V | R 

const lastDelegateCollector
= < T, R = never > (value : T) =>
  (computed_value : Maybe < R >): LastDelegateCollector < T, R > =>
  delegate =>
  isNothing (computed_value)
  ? typeof delegate === 'function'
    ? (delegate as (value : T) => unknown) (value as any) as any
    : delegate
  : computed_value.value
    
type DelegateCollector < T, TA = T, R = never >
= < V, D extends ((value : TA) => unknown) > (delegate : V | D) =>
  typeof delegate extends D
  ? D extends (value : TA) => infer RA
    ? PredicateCollector < T, R | RA >
    : never
  : V extends (value : infer TInV) => infer RA
    ? TInV extends T
      ? PredicateCollector < T, R | RA >
      : never
  : PredicateCollector < T, R | V >

const delegateCollector
= < T, TA, R > (value : T) =>
  (computed_value : Maybe < R >) =>
  (compute_value : boolean): DelegateCollector < T, TA, R > =>
  delegate =>
  compute_value
  ? predicateCollector (value) 
    (
      typeof delegate === 'function'
      ? Just ((delegate as (value : T) => unknown) (value))
      : Just (delegate)
    ) as any
  : predicateCollector (value) (computed_value)

type PredicateCollector < T, R = never >
= < P extends ((value : T) => boolean) | Otherwise | boolean > (predicate : P) =>
  P extends Otherwise
    ? LastDelegateCollector < T, R >
  : P extends (value : unknown) => value is infer TA
    ? DelegateCollector < T, TA, R >
  : P extends (value : T) => boolean
    ? P extends (value : infer PR extends T) => value is infer PR
      ? DelegateCollector < T, PR, R >
    : DelegateCollector < T, T, R > 
  : DelegateCollector < T, T, R >

const predicateCollector
= < T, R > (value : T) =>
  (computed_value : Maybe < R >): PredicateCollector < T, R > =>
  predicate =>
  predicate === otherwise
  ? lastDelegateCollector < T, R > (value) (computed_value) as any
  : isNothing (computed_value)
    ? delegateCollector (value) (computed_value) (
      typeof predicate === 'function'
      ? predicate (value)
      : predicate
    )
  : delegateCollector (value) (computed_value) (false)

type Match
= < T > (value: T) =>
  PredicateCollector < T >

export const match : Match 
= value =>
predicateCollector (value) (Nothing ())

