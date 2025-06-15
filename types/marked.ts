export type Marked < TMark extends symbol, T >
= T & {
    get mark () : TMark,
  }

