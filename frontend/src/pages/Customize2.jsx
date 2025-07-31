import React, { useState, useContext } from 'react'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { MdKeyboardBackspace } from 'react-icons/md'


function Customize2() {
  const { userData, backendImage, selectedImage,serverUrl,setUserData } = useContext(userDataContext)
  const [assistantName, setAssistantName] = useState(userData?.assistantName || "");
  const { loading, setLoading } = useState(false);
  const navigate = useNavigate();

  const handleUpdateAssistant = async() => {
    try{
      let formData = new FormData()
      formData.append('assistantName', assistantName)
      if(backendImage){
        formData.append('assistantImage', backendImage)
      }else{
        formData.append('imageUrl', selectedImage)
      }
      const result = await axios.post(`${serverUrl}/api/user/update`, formData, {withCredentials:true})
      console.log(result.data)
      setUserData(result.data)
    }catch(error){
      console.log(error)
    }

  }
  return (
    <div className='w-full min-h-screen bg-gradient-to-t from-[black] to-[#030353] relative'>
      <MdKeyboardBackspace 
        className='text-white cursor-pointer absolute left-8 top-8' 
        style={{ fontSize: '3rem' }} 
        onClick={() => navigate(-1)} 
      />
      <div className='flex flex-col items-center justify-center w-full min-h-screen'>
        <h1 className='text-white text-center text-[30px] font-semibold mb-[30px]'>ENTER YOUR <span className='text-blue-200'>ASSISTANT NAME</span></h1>
        <input
          type='text'
          placeholder='Assistant Name'
          className='w-full max-w-[600px] h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]'
          
          required onChange={(e) => setAssistantName(e.target.value)}
          value={assistantName}
        />
        {assistantName.length > 0 && <button className='min-w-[300px] h-[60px] mt-[30px] text-black font-semibold bg-white rounded-full text-[19px] cursor-pointer' disabled={loading} onClick={(e) => {
          
          e.target.style.backgroundColor = '#d1d5db'; // Tailwind's bg-gray-300
          e.target.style.color = '#d1d5db'; // Tailwind's text-gray-600
          
          handleUpdateAssistant();
          navigate('/home')
        }}>{!loading?"CREATE YOUR ASSISTANT":"Loading.."}</button>}
        
      </div>
    </div>
  )
}

export default Customize2