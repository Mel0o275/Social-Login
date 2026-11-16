import { ForbidenException } from "../Common/Exceptions/error.exception.js"

export const authorizationMiddleware = (accessRoles = []) => {
    return async(req, res, next) => {
        if(!accessRoles.includes(req.user.role)) {
            throw ForbidenException({
                message: "Inssuficent Permission"
            })
        }
        next()
    }
}