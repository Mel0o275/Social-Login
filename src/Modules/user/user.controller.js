import { roleEnum } from "../../Common/Enums/role.enum.js"
import { TokenType } from "../../Common/Enums/tokenType.enum.js"
import { successResponse } from "../../Common/Utils/Response/success.response.js"
import { authenticationMiddleware } from "../../Middleware/authentication.middleware.js"
import { authorizationMiddleware } from "../../Middleware/authoriztion.middleware.js"
import * as userService from "./user.service.js"
import {Router} from "express"
const router = Router()

router.get("/profile",authenticationMiddleware(), async(req, res) => {
    const result = await userService.profile(req.user)
    successResponse({
        res,
        data: result,
        message: "Users Retreived successfully"
    })
})

router.post("/rotate-token",authenticationMiddleware(TokenType.REFRESH), async(req, res) => {
    console.log(`Hello`);
    
    const result = await userService.rotateToken(req.user, `${req.protocol}://${req.host}`)
    successResponse({
        res,
        data: result,
        message: "Users Genrated Tokens successfully"
    })
})

export default router