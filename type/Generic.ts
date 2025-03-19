export type GenericAPIResponse = {
    status: number,
    payload: string
}

export type ActionResponse<T> = {
    status: number,
    message?: string,
    payload?: T
}