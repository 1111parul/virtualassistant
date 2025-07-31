import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import genToken from "../config/token.js"

export const signUp=async (req,res)=>{
    try{
        const { name, email, password } = req.body


        const existEmail=await User.findOne({email})
        if(existEmail){
            return res.status(400).json({message:"email already exists!"})
        }
        if(password.length<6){
            return res.status(400).json({message:"password must be atleast 6 characters!"})
        }

        const hashedPassword = await bcrypt.hash(password,10)   //10:salt

        const user = await User.create({
            name, password:hashedPassword,email
        })

        const token = await genToken(user._id)                      //token generated    //mongodb generated id itself

        res.cookie("token",token,{                                             //token passed to cookie
            httpOnly:true,
            maxAge:7*24*60*60*1000,                                //value in milliseconds
            sameSite:"strict",
            secure:false
        })

        return res.status(201).json(user)
    }catch(error){
        return res.status(500).json({message: `signup error ${error.message}`})
    }
}


//controller for login 

export const LogIn=async (req,res)=>{
    try{
        const {email,password}=req.body

        const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"email does not exist!"})
        }
        if(password.length<6){
            return res.status(400).json({message:"password must be atleast 6 characters!"})
        }

        const isMatch = await bcrypt.compare(password,user.password)

        if(!isMatch){
            return res.status(400).json({message:"incorrect password"})
        }

        const token = await genToken(user._id)                      //token generated    //mongodb generated id itself

        res.cookie("token",token,{                                             //token passed to cookie
            httpOnly:true,
            maxAge:7*24*60*60*1000,                                //value in milliseconds
            sameSite:"strict",
            secure:false
        })

        return res.status(200).json({ message: "Sign in successful!", user });

        //return res.status(200).json(user)
    }catch(error){
        return res.status(500).json({message: `login error ${error}`})
    }
}



//controller for logout

export const logOut = async (req,res)=>{
    try{
        res.clearCookie("token")
        return res.status(200).json({message: `log out successfully`})
        return res.status(500).json({message: `logout error ${error}`})
    }catch(error){

    }
}