export type GenSalt
= () => string

export const GenSalt : GenSalt
= () => { throw new Error () }

export type HashString 
= (salt : string) => (plain : string) => string

export const HashString : HashString
= () => { throw new Error () }

