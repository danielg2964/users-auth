import { Failure } from "#types/failure.ts";

export const EMAIL_IN_USE : Failure
= Failure ('Email is in use') ('EMAIL_IN_USE')

export const FATHER_DOESNT_EXIST : Failure
= Failure ('Father doesnt exist') ('FATHER_DOESNT_EXIST')

export const USER_NOT_FOUND : Failure
= Failure ('User not found') ('USER_NOT_FOUND')

export const REQUESTER_NOT_FOUND : Failure
= Failure ('Requester not found') ('REQUESTER_NOT_FOUND')

