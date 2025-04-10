class ApiError extends Error {
    constructor(
        statusCode,
        message,
        error = [],
        stack = ""
    ){
        super(message);
        this.statusCode = statusCode
        this.message = message
        this.errors = error
        this.success = false

        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this, this.constructor)
        } 
    }
}

export {ApiError}