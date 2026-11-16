import { successResponse } from "../../Common/Utils/Response/success.response.js"
import * as authService from "./auth.service.js"
import {Router} from "express"
const router = Router()

router.post("/signup", async(req, res) => {
    const result = await authService.signup(req.body)
    successResponse({
        res,
        data: result,
        message: "User Created Successfully",
        status: 201
    })
})

router.post("/login", async(req, res) => {
    const result = await authService.login(req.body, 
        `${req.protocol}://${req.host}`
    )
    successResponse({
        res,
        data: result,
        message: "User Logged in Successfully",
        status: 200
    })
})

router.post("/google", async(req, res) => {
    const result = await authService.loginOrSignupWithGoogle(req.body, 
        `${req.protocol}://${req.host}`
    )
    successResponse({
        res,
        data: result,
        message: "User Logged in Successfully",
        status: 200
    })
})

router.post("/facebook", async(req, res) => {
    const result = await authService.loginOrSignupWithFacebook(req.body, 
        `${req.protocol}://${req.host}`
    )
    successResponse({
        res,
        data: result,
        message: "User Logged in Successfully",
        status: 200
    })
})

export default router