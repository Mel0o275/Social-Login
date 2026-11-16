import { SALT_ROUNDS } from "../../Config/config.js";
import bcrypt from "bcrypt"

export const hashData = async(data, salt = SALT_ROUNDS) => {
    return bcrypt.hash(data, salt)
}

export const compareHash = async(data, hashedData) => {
    return bcrypt.compare(data, hashedData)
}