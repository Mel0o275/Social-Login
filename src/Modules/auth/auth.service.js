import axios from "axios"
import { providerEnum } from "../../Common/Enums/role.enum.js"
import { BadRequestError, ConflictException, NotFoundException, UnauthorizedException } from "../../Common/Exceptions/error.exception.js"
import { encryptData } from "../../Common/security/encruption.security.js"
import { compareHash, hashData } from "../../Common/security/hash.security.js"
import { createTokenCredintials, generateToken } from "../../Common/security/token.security.js"
import { ACCESS_TOKEN_EXPIRE_TIME, GOOGLE_CLIENT_ID, REFRESH_TOKEN_EXPIRE_TIME, USER_ACCESS_JWT_SECRET_KEY, USER_REFRESH_JWT_SECRET_KEY } from "../../Config/config.js"
import { UserModel } from "../../DB/Models/user.model.js"
import { OAuth2Client } from 'google-auth-library'

export const signup = async (body) => {
    const { firstName, lastName, email, password, gender, role, phone } = body

    let errors = []

    if (!firstName || !lastName || !email || !password) {
        errors.push("All fields are required")
    }

    if (firstName && (firstName.length < 3 || firstName.length > 30)) {
        errors.push("FirstName must be greater than 3 chars and less than 30")
    }

    if (lastName && (lastName.length < 3 || lastName.length > 30)) {
        errors.push("LastName must be greater than 3 chars and less than 30")
    }

    if (password && (password.length < 3 || password.length > 30)) {
        errors.push("Password must be greater than 3 chars and less than 30")
    }

    if (email && !email.includes("@")) {
        errors.push("Email must be a valid email")
    }

    if (errors.length > 0) {
        throw BadRequestError({
            message: "VAlidation errors",
            options: { cause: { status: 400, errors } }
        })
    }

    const userExist = await UserModel.findOne({ email })

    if (userExist) {
        throw ConflictException({
            message: "Email Already exist"
        })
    }

    const encryptedPhone = await encryptData(phone)

    const hashedPass = await hashData(password)

    const user = await UserModel.create({
        firstName, lastName, email, password: hashedPass, gender, role, phone: encryptedPhone, provider: providerEnum.SYSTEM
    })



    return { user }
}

export const login = async (body, issuer) => {
    const { email, password } = body

    const userExist = await UserModel.findOne({ email })

    if (!userExist) {
        throw NotFoundException({
            message: "User Not Found"
        })
    }

    const comparePass = await compareHash(password, userExist.password)

    if (!comparePass) {
        throw UnauthorizedException({
            message: "Email or Password are not correct"
        })
    }

    const { token, refreshToken } = await createTokenCredintials(userExist, issuer)

    return { token, refreshToken }
}

const client = new OAuth2Client();
async function verify(credential) {
    const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: GOOGLE_CLIENT_ID,  // Specify the WEB_CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[WEB_CLIENT_ID_1, WEB_CLIENT_ID_2, WEB_CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // This ID is unique to each Google Account, making it suitable for use as a primary key
    // during account lookup. Email is not a good choice because it can be changed by the user.
    return payload
}

export const signupWithGoogle = async (body) => {
    const { credential } = body
    const payload = await verify(credential)
    console.log({ payload });

    if (!payload?.email_verified) {
        throw BadRequestError({
            message: "Email is not verified"
        })
    }

    const userExist = await UserModel.findOne({ email: payload.email })

    if (userExist) {
        throw ConflictException({
            message: "User Already Exist"
        })
    }

    const user = await UserModel.create({
        email: payload.email,
        firstName: payload.given_name,
        provider: providerEnum.GOOGLE
    })

    return "User Created Successfully"
}

export const loginWithGoogle = async (body, issuer) => {
    const { credential } = body
    const payload = await verify(credential)
    console.log({ payload });

    if (!payload?.email_verified) {
        throw BadRequestError({
            message: "Email is not verified"
        })
    }

    const userExist = await UserModel.findOne({ email: payload.email })

    if (!userExist) {
        throw NotFoundException({
            message: "User Not Found"
        })
    }

    const { token, refreshToken } = await createTokenCredintials(userExist, issuer)

    return { token, refreshToken }
}

export const loginOrSignupWithGoogle = async (body, issuer) => {
    const { credential } = body;

    const payload = await verify(credential);

    if (!payload?.email_verified) {
        throw BadRequestError({
            message: "Email is not verified"
        });
    }

    let user = await UserModel.findOne({
        email: payload.email
    });

    // Check if user registered using email & password
    if (user && user.provider === providerEnum.SYSTEM) {
        throw ConflictException({
            message: "This email is already registered using email and password. Please login with your password."
        });
    }

    // Signup if user doesn't exist
    if (!user) {
        user = await UserModel.create({
            email: payload.email,
            firstName: payload.given_name,
            provider: providerEnum.GOOGLE
        });
    }

    const { token, refreshToken } = await createTokenCredintials(
        user,
        issuer
    );

    return { token, refreshToken };
};

export const loginOrSignupWithFacebook = async (body, issuer) => {
    console.log(body);

    const { accessToken } = body;

    if (!accessToken) {
        throw NotFoundException({
            message: "Token is required"
        })
    }

    const result = await axios.get(
        "https://graph.facebook.com/me",
        {
            params: {
                fields: "id,name,email",
                access_token: accessToken
            }
        }
    );

    const payload = result.data;
    console.log({payload});
    
    let user = await UserModel.findOne({
        email: payload.email
    });

    if (user && user.provider === providerEnum.SYSTEM) {
        throw ConflictException({
            message: "Please login using email and password"
        });
    }

    if (!user) {
        const [firstName, ...lastName] = payload.name.split(" ");

        user = await UserModel.create({
            email: payload.email,
            firstName,
            lastName: lastName.join(" "),
            provider: providerEnum.FACEBOOK
        });
    }

    const { token, refreshToken } = await createTokenCredintials(
        user,
        issuer
    );

    return {
        user: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        },
        token,
        refreshToken
    };
};