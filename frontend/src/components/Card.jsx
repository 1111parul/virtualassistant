// import React from 'react'

// function Card({image}) {
//   return (
//     <div className='w-[150px] h-[250px] bg-[#030326] border-2 border-[blue] rounded-2xl overflow-hidden'>
//         <img src={image} className='h-full object-cover' />
//         </div>
//   )
// }

// export default Card


import React, { useContext } from 'react'
import { userDataContext } from '../context/UserContext'

function Card({ image }) {
  const {serverUrl,userData,setUserData,backendImage,setBackendImage,frontendImage,setFrontendImage,selectedImage,setSelectedImage
}=useContext(userDataContext)
  return (
<div
      className={`w-[150px] h-[200px] 
                  flex justify-center items-center 
                  rounded-xl 
                  bg-[#022020] border-2 border-black rounded-2xl 
                  overflow-hidden hover:shadow-2xl hover:shadow-blue-500 
                  cursor-pointer 
                  ${(selectedImage == image && selectedImage !== 'input') ? "border-4 border-white" : null}`}
                  onClick={() => {setSelectedImage(image)
                                 setBackendImage(null)
                                 setFrontendImage(null)
                  }}>

      <img
        src={image}
        alt="AI Avatar"
        className="w-full h-full object-cover rounded-xl"
      />
</div>
    
  
  


  )
}

export default Card










