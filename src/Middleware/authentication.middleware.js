import { TokenType } from "../Common/Enums/tokenType.enum.js"
import { NotFoundException, UnauthorizedException } from "../Common/Exceptions/error.exception.js"
import { decodeToken, verifyToken } from "../Common/security/token.security.js"
import { USER_ACCESS_JWT_SECRET_KEY, USER_REFRESH_JWT_SECRET_KEY } from "../Config/config.js"
import { UserModel } from "../DB/Models/user.model.js"

export const authenticationMiddleware = (tokenType = TokenType.ACCESS) => {
    return async(req, res, next) => {
    const {authorization} = req.headers

    if(!authorization) {
        throw NotFoundException({
            message: "Token Not Found"
        })
    }

    const {user, payload} = await decodeToken({
        authorization,
        tokenType,
        issuer: `${req.protocol}://${req.host}`
    })

    req.user = user
    req.payload = payload

    next()
}
}