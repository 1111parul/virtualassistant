import mongoose from "mongoose";                                                             //mongoose ke through model bnega



const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    assistantName:{
        type:String,
    },
    // name:{
    //     type:String,
        
    // },
    assistantImage: {         
    type: String
    },
    history: [
  {
    input: { type: String },
    output: { type: String },
    type: { type: String },
    timestamp: { type: Date, default: Date.now }
  }
]

},{timestamps:true}) 

const User = mongoose.model("User",userSchema)                     //User model is made and exported
export default User

