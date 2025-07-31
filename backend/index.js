import express from "express"
import dotenv from "dotenv"
dotenv.config()
import connectDb from "./config/db.js"
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.routes.js"
import cors from "cors"
import userRouter from "./routes/user.routes.js"
import speechRouter from "./routes/speech.routes.js"
import geminiResponse from "./gemini.js"
//import  './liveTranscriptionServer.js'; 
//import fileUpload from 'express-fileupload';





const app=express()
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
const port=process.env.PORT || 5000

app.use(express.json())
app.use(cookieParser())



app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)

// app.get('/',async (req,res)=>{
//     let prompt=req.query.prompt;
//     let data=await geminiResponse(prompt)
//     res.json(data)
// })



app.listen(port,()=>{
    connectDb()                                          //jaise hi humara server start hom listen karna, turant db connect ho jaye
    console.log("server started")
})

