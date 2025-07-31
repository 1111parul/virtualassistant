import React, { createContext } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from "axios"
// import { Children } from 'react'

export const userDataContext=createContext()


function UserContext({children}) {
  const serverUrl="http://localhost:8000"
  const [userData,setUserData]=useState(null)
  const [frontendImage,setFrontendImage]=useState(null)
  const [backendImage,setBackendImage]=useState(null)
  const [selectedImage,setSelectedImage]=useState(null)

  


  const handleCurrentUser=async ()=>{
    try{
      const result=await axios.get(`${serverUrl}/api/user/current`,{withCredentials:true})
      setUserData(result.data);
      console.log("[handleCurrentUser] Loaded user:", result.data);
    } catch (error) {
      console.log("Error in handleCurrentUser:", error);
    }
  } 


  const getGeminiResponse=async (command)=>{
    try{
      const result=await axios.post(`${serverUrl}/api/user/asktoassistant`,{command},{withCredentials:true})

      //added line from chatgpt
      await handleCurrentUser();

      return result.data
    }catch (error) {
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error("Axios Error - Response:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else if (error.request) {
      // Request was made but no response received
      console.error("Axios Error - No Response:", error.request);
    } else {
      // Something else caused an error
      console.error("Axios Error - General:", error.message);
    }
  }
  }


  useEffect(()=>{
    handleCurrentUser()
  },[])
  const value={
    serverUrl,userData,setUserData,backendImage,setBackendImage,frontendImage,setFrontendImage,selectedImage,setSelectedImage,handleCurrentUser,getGeminiResponse,

  }
  return (
    <div>
      <userDataContext.Provider value={value}>
    {children}
    </userDataContext.Provider>
    </div>
  )
}

export default UserContext





