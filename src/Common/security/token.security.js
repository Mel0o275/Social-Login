import { ACCESS_TOKEN_EXPIRE_TIME, ADMIN_ACCESS_JWT_SECRET_KEY, ADMIN_REFRESH_JWT_SECRET_KEY, REFRESH_TOKEN_EXPIRE_TIME, USER_ACCESS_JWT_SECRET_KEY, USER_REFRESH_JWT_SECRET_KEY } from "../../Config/config.js";
import jwt, { decode } from 'jsonwebtoken';
import { TokenType } from "../Enums/tokenType.enum.js";
import { UserModel } from "../../DB/Models/user.model.js";
import { roleEnum } from "../Enums/role.enum.js";

export const generateToken = async({payload = {}, secretKey = USER_ACCESS_JWT_SECRET_KEY, options = {}}) => {
    return jwt.sign(payload, secretKey, options)
}

export const verifyToken = async({token, secretKey = USER_ACCESS_JWT_SECRET_KEY, options = {}}) => {
    return jwt.verify(token, secretKey, options)
}

export const createTokenCredintials = async(user, issuer) => {

    const signature = await getTokenSignatureRole(user.role)
    const token = await generateToken({
        payload: { sub: user._id },
        options: {
            expiresIn: ACCESS_TOKEN_EXPIRE_TIME,
            issuer,
            audience: [user.role]
        },
        secretKey: signature.access
    })

    const refreshToken = await generateToken({
        payload: { sub: user._id },
        options: {
            expiresIn: REFRESH_TOKEN_EXPIRE_TIME,
            issuer,
            audience: [user.role]
        },
        secretKey: signature.refresh
    })
    return {token, refreshToken}
}

export const getTokenType = async({tokenType, role}) => {
    let signature = await getTokenSignatureRole(role)
    switch (tokenType) {
        case TokenType.ACCESS:
            return signature.access
            break;
    case TokenType.REFRESH:
            return signature.refresh
            break;
        default:
            throw NotFoundException({
                message: "Invalid Token Type"
            })
            break;
    }
}

export const decodeToken = async({authorization, tokenType, issuer}) => {
    const decoded = jwt.decode(authorization)

    if(!decoded?.aud?.length) {
        throw NotFoundException({
            message: "Audience is missing"
        })
    }
    const payload = await verifyToken({
            token: authorization,
            options: {
                issuer
            },
            secretKey: await getTokenType({tokenType, role: decoded.aud[0]})
        })
    
        if(!payload) {
            throw UnauthorizedException({
                message: "Invalid Token"
            })
        }
    
        const user = await UserModel.findById(payload.sub)
        if(!user) {
            throw NotFoundException({
                message: "User Not Found"
            })
        }

        return {user, payload}
}

export const getTokenSignatureRole = async(role = roleEnum.User) => {
    let signature = {}

    switch (role) {
        case roleEnum.Admin:
            signature = {
                access : ADMIN_ACCESS_JWT_SECRET_KEY,
                refresh: ADMIN_REFRESH_JWT_SECRET_KEY
            }
            break;
    
        default:
            signature = {
                access : USER_ACCESS_JWT_SECRET_KEY,
                refresh: USER_REFRESH_JWT_SECRET_KEY
            }
            break;
    }

    return signature
}