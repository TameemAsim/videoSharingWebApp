export const createError = (status: number, message: string) => {
    
    interface ErrorWithStatus extends Error {
        status?: number
    }
    const err: ErrorWithStatus = new Error()
    err.status = status
    err.message= message
    return err
}