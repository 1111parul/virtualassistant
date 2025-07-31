import uploadOnCloudinary from "../config/cloudinary.js"
import User from "../models/user.model.js"
import moment from "moment"
import geminiResponse from "../gemini.js"
// import { updateAssistant } from "react"
export const getCurrentUser=async (req,res)=>{
    try{
        const userId=req.userId
        const user=await User.findById(userId).select("-password")
        if(!user){
            return res.status(400).json({message:"user not found"})
        }
    
    return res.status(200).json(user)
    } catch(error){
        return res.status(400).json({message:"get current user error"})
    }
}

// export const updateAssistant=async (req,res)=>{
//     try{
//         const {assistantName,imageUrl}=req.body
//         let assistantImage;
//         if(req.file){
//             assistantImage=await uploadOnCloudinary(req.file.path)
//         }else{
//             assistantImage=imageUrl
//         }

//         const user=await User.findByIdAndUpdate(req.userId,{
//             assistantName,assistantImage
//         },{new:true}).select("-password")
//         return res.status(200).json(user)
//     }catch(error){
//         return res.status(400).json({message:"updateAssistant error"})

//     }

    
// }


export const updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body;

    console.log("assistantName:", assistantName);
    console.log("imageUrl:", imageUrl);
    console.log("req.file:", req.file);

    let assistantImage;

    if (req.file) {
      assistantImage = await uploadOnCloudinary(req.file.path);
    } else {
      assistantImage = imageUrl;
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        assistantName,
        assistantImage,
      },
      { new: true } // return the updated document
    ).select("-password");

    console.log("Updated user:", user);

    return res.status(200).json(user);
  } catch (error) {
    console.error("updateAssistant error:", error);
    return res.status(400).json({ message: "updateAssistant error", error: error.message });
  }
}


export const askToAssistant=async (req,res)=>{
  try {
    const { command } = req.body;
    console.log("[askToAssistant] Received command from frontend:", command);
    console.log("req.user:", req.user);

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userName = user.name;
    const assistantName = user.assistantName;

    const result = await geminiResponse(command, assistantName, userName);
    console.log("[askToAssistant] Raw Gemini response for command:", command, "=>", result);

    if (!result || typeof result !== 'string') {
      console.log("[askToAssistant] Gemini not responding for command:", command);
      return res.status(500).json({ response: "No response from Gemini" });
    }

    const jsonMatch = result.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      return res.status(400).json({ response: "sorry, I can't understand" });
    }

    let gemResult;
    try {
      gemResult = JSON.parse(jsonMatch[0]);
    } catch (e) {
      return res.status(500).json({ response: "Gemini returned invalid JSON", geminiRaw: result });
    }

    // Normalize type for common variations
    let type = gemResult.type?.toLowerCase().replace(/[-_ ]/g, "");
    if (type === "youtubesearch" || type === "youtubeopen" || type === "youtube") type = "youtube-search";
    if (type === "youtubeplay") type = "youtube-play";
    if (type === "googlesearch" || type === "googleopen" || type === "google") type = "google-search";
    if (type === "instagramopen" || type === "instagram") type = "instagram-open";
    if (type === "calculatoropen" || type === "calculator") type = "calculator-open";
    if (type === "facebookopen" || type === "facebook") type = "facebook-open";
    if (type === "weathershow" || type === "weather") type = "weather-show";
    if (type === "gettime" || type === "time") type = "get-time";
    if (type === "getdate" || type === "date") type = "get-date";
    if (type === "getday" || type === "day") type = "get-day";
    if (type === "getmonth" || type === "month") type = "get-month";
    if (type === "general") type = "general";
    if (type === "linkedinopen" || type === "linkedin") type = "linkedin-open";
    if (type === "twitteropen" || type === "twitter") type = "twitter-open";
    if (type === "githubopen" || type === "github") type = "github-open";

    if (gemResult.type === "error") {
      return res.status(500).json({ response: gemResult.response });
    }

    switch (type) {
      case 'get-date':
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `current date is ${moment().format("YYYY-MM-DD")}`
        });
      case 'get-time':
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `current time is ${moment().format("hh:mm A")}`
        });
      case 'get-day':
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `today is ${moment().format("dddd")}`
        });
      case 'get-month':
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `current month is ${moment().format("MMMM")}`
        });
      case 'google-search':
      case 'youtube-search':
      case 'youtube-play':
      case 'general':
      case 'calculator-open':
      case 'instagram-open':
      case 'facebook-open':
      case 'weather-show':
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: gemResult.response,
        });
      default:
        return res.status(400).json({ response: "I didn't understand the command." });
    }
  } catch (error) {
    console.error("Error in askToAssistant:", error.message);
    console.error("Full stack:", error.stack);
    return res.status(500).json({ response: "ask assistant error", error: error.message });
  }
}

    