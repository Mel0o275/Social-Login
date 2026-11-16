import { decryptData } from "../../Common/security/decruption.security.js"
import { createTokenCredintials, generateToken, verifyToken } from "../../Common/security/token.security.js"
import { ACCESS_TOKEN_EXPIRE_TIME, REFRESH_TOKEN_EXPIRE_TIME, USER_ACCESS_JWT_SECRET_KEY, USER_REFRESH_JWT_SECRET_KEY } from "../../Config/config.js"


export const profile = async (user) => {
    let decryptedPhone = null;

    if (user.phone) {
        decryptedPhone = await decryptData(user.phone);
    }

    return {
        ...user.toObject(),
        phone: decryptedPhone
    };
}

export const rotateToken = async (user, issuer) => {

    const { token, refreshToken } = await createTokenCredintials(user, issuer)

    return { token, refreshToken }
}

