import type { Marked } from "./marked.ts";
import { isJust, Just, Nothing, type Maybe } from "./maybe.ts";

const ListMark : unique symbol
= Symbol ()

type ListMark
= typeof ListMark

export type List < T >
= Marked < ListMark > & {
    get head () : T
  , get tail () : Maybe < List < T > >
  }

const createList : < T > (head : T) => (tail : Maybe < List < T > >) => List < T >
= < T > (head : T) =>
  (tail : List < T > | Maybe < List < T > >) : List < T > =>
  ({ 
    mark : ListMark
  , head : head 
  , tail : 
      isList (tail) 
      ? Just (createList (tail.head) (tail.tail))
      : isJust (tail)
        ? Just (createList (tail.value.head) (tail.value.tail))
        : Nothing ()
  })

export const isList
= < T > (value : unknown) : value is List < T > =>
  value !== null
  && value !== undefined
  && typeof value === 'object'
  && (value as List < T >).mark === ListMark 

export const append
= < T > (list : List < T >) =>
  (value : T) : List < T > =>
  createList (value) (Just (list))

export const map
= < T > (list : List < T >) =>
  < R > (delegate : (value : T) => R) : List < R > =>
  createList (delegate (list.head))
    (
      isJust (list.tail)
      ? Just (map (list.tail.value) (delegate))
      : Nothing ()
    ) 

export const filter
= < T > (list : List < T >) =>
  (predicate : (value : T) => boolean) : Maybe < List < T > > =>
  predicate (list.head)
  ? isJust (list.tail)
    ? Just (createList (list.head) (filter (list.tail.value) (predicate)))
    : Just (createList (list.head) (list.tail))
  : isJust (list.tail)
    ? filter (list.tail.value) (predicate)
    : Nothing ()

export const List
= < T > (value : T) : List < T > =>
  createList (value) (Nothing ())

