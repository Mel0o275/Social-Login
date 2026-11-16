import {randomBytes, createCipheriv} from "crypto"
import { ENCRYPTION_ALGORITHM, ENCRYPTION_SECRET_KEY } from "../../Config/config.js"

export const encryptData = async(data) => {
    const iv = randomBytes(16)

    const cipther = createCipheriv(
        ENCRYPTION_ALGORITHM,
        Buffer.from(ENCRYPTION_SECRET_KEY, "hex"),
        iv
    )

    let encryptedData = cipther.update( 
        String(data),
        "utf8",
        "hex"
    )

    encryptedData += cipther.final("hex")

    return `${iv.toString("hex")}:${encryptedData}`
}