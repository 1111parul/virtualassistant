import React, { useContext } from 'react'
import { useState,useRef } from 'react'
import { MdKeyboardBackspace } from 'react-icons/md'
import Card from '../components/Card'
import image1 from '../assets/image1.png'
import image2 from '../assets/image2.jpg'
import image3 from '../assets/image4.png'
import image4 from '../assets/image5.png'
import image5 from '../assets/image6.jpeg'
import image6 from '../assets/image7.jpeg'
import image7 from '../assets/authBg.png'
//import { RiImageAddLine } from 'react-icons/ri'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Customize() {

  const {serverUrl,userData,setUserData,backendImage,setBackendImage,frontendImage,setFrontendImage,selectedImage,setSelectedImage} = useContext(userDataContext)
  const inputImage = useRef()
  const navigate = useNavigate()

  const handleImage = (e) => {
    const file = e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
    setSelectedImage('input')
  }

  
  return (
    <div className='w-full min-h-screen bg-gradient-to-t from-[black] to-[#030353]'>
      <MdKeyboardBackspace 
        className='text-white cursor-pointer absolute left-8 top-8' 
        style={{ fontSize: '3rem' }} 
        onClick={() => navigate('/')} 
      />
      <div className='flex flex-col items-center justify-center min-h-screen'>
        <h1 className='text-white text-center text-[30px] font-semibold mb-[30px]'>SELECT YOUR <span className='text-blue-200'>ASSISTANT IMAGE</span></h1>
        <div className='max-w-[900px] flex flex-wrap justify-center items-center pb-[60px] gap-x-[220px] gap-y-[90px] mx-[160px] my-[60px]'>
          <Card image={image1}  />
          <Card image={image2}  />
          <Card image={image3}  />
          <Card image={image4}  />
          <Card image={image5}  />
          <Card image={image6}  />
          <Card image={image7}  />
          <div
            className={`w-[150px] h-[200px]
              flex justify-center items-center
              rounded-xl
              bg-[#022020] border-2 border-black rounded-2xl
              overflow-hidden hover:shadow-2xl hover:shadow-blue-500
              cursor-pointer
              ${selectedImage === 'input' ? "border-4 border-white" : null}`}
            onClick={() => {
              setSelectedImage('input');
              inputImage.current.click();
            }}
          >
            {frontendImage ? (
              <img src={frontendImage} className='h-full object-cover'/>
            ) : (
              <span role="img" aria-label="upload" className="text-3xl">🖼️</span>
            )}
          </div>
          <input type='file' accept='image/*' ref={inputImage} hidden onChange={handleImage}/>
        </div>
        {selectedImage && (
          <button className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white rounded-full text-[19px] cursor-pointer' onClick={() => {
            // ...existing code...
            navigate('/customize2');
          }}>
            Next
          </button>
        )}
      </div>
    </div>
  )
}

export default Customize