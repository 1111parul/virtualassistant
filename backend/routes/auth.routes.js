import express from "express"
import { LogIn, logOut, signUp } from "../controllers/auth.controllers.js"


const authRouter = express.Router()

authRouter.post("/signup",signUp)
authRouter.post("/signin",LogIn)
authRouter.get("/logout",logOut)
export default authRouter

