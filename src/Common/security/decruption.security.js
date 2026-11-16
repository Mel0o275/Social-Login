import {createDecipheriv} from "crypto"
import { ENCRYPTION_ALGORITHM, ENCRYPTION_SECRET_KEY } from "../../Config/config.js"

export const decryptData = async(encryptedvalue) => {
    const [iv, encryptedData] = encryptedvalue.split(":")

    const decipther = createDecipheriv(
        ENCRYPTION_ALGORITHM,
        Buffer.from(ENCRYPTION_SECRET_KEY, "hex"),
        Buffer.from(iv, "hex")
    )

    let decryptedData = decipther.update( 
        encryptedData,
        "hex",
        "utf8"
    )

    decryptedData += decipther.final("utf8")

    return decryptedData
}