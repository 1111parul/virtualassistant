import { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import React from 'react'
import axios from 'axios'
import { userDataContext } from '../context/UserContext'

import userGif from '../assets/user.gif'
import aiGif from '../assets/ai.gif'


function Home() {
  const {userData,serverUrl,setUserData,getGeminiResponse,handleCurrentUser}=useContext(userDataContext)
  // Greet user only once on initial page load
  const greetedRef = useRef(false);
  useEffect(() => {
    if (userData?.name && !greetedRef.current) {
      const greeting = `Hello! ${userData.name}, How can I help you?`;
      speak(greeting);
      greetedRef.current = true;
    }
    // Only runs once for the first available userData.name
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?.name]);
  const navigate = useNavigate()

  const [listening, setListening] = useState(false)
  const [userText, setUserText] = useState('')
  const [aiText, setAiText] = useState('')
  const [isSpeaking, setIsSpeaking] = useState(false)
  
  const isSpeakingRef = useRef(false)
  const recognitionRef = useRef(null)
  const synth = window.speechSynthesis
  const handleLogOut= async()=>{
    try{
      const result = await axios.get(`${serverUrl}/api/auth/logout`, {withCredentials:true})
      setUserData(null)
      navigate('/signup')
    }
  catch(error){
    console.log(error)
    setUserData(null)

  }
}
   




  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text)
    isSpeakingRef.current = true
    setIsSpeaking(true)
    utterance.onend = () => {
      isSpeakingRef.current = false
      setIsSpeaking(false)
      recognitionRef.current?.start()
    }
    synth.speak(utterance)
  }

  const handleCommand = (data) => {
  const { type: rawType, userInput, response } = data;
  const cleanedInput = userInput?.trim().toLowerCase();
  let type = rawType?.toLowerCase();


  // Normalize some type values
  if (type === "linkedin" || type === "linkedinopen") type = "linkedin-open";
  if (type === "github" || type === "githubopen") type = "github-open";
  if (type === "twitter" || type === "twitteropen") type = "twitter-open";
  if (type === "facebook" || type === "facebookopen") type = "facebook-open";
  if (type === "instagram" || type === "instagramopen") type = "instagram-open";
  if (type === "email" || type === "emailopen") type = "email-open";


  const openPopup = (url) => {
    const win = window.open(url, '_blank');
    if (!win) {
      alert("Popup blocked. Please allow popups for this site.");
    }
  };

  const socialMediaUrls = {
    'linkedin-open': 'https://www.linkedin.com/feed/',
    'twitter-open': 'https://twitter.com/',
    'github-open': 'https://github.com/',
    'facebook-open': 'https://www.facebook.com/',
    'instagram-open': 'https://www.instagram.com/',
    'email-open': 'https://mail.google.com/mail/u/0/#inbox',
  };

  const searchUrls = {
    'linkedin-open': (query) => `https://www.linkedin.com/search/results/all/?keywords=${query}`,
    'twitter-open': (query) => `https://twitter.com/search?q=${query}`,
    'github-open': (query) => `https://github.com/search?q=${query}`,
    'facebook-open': (query) => `https://www.facebook.com/search/top/?q=${query}`,
    'instagram-open': (query) => `https://www.instagram.com/${query}`,
  };

  if (type in socialMediaUrls) {
    if (cleanedInput === `open ${type.split('-')[0]}` || cleanedInput === `${type.split('-')[0]}`) {
      openPopup(socialMediaUrls[type]);
    } else {
      const query = encodeURIComponent(userInput);
      const searchUrl = searchUrls[type] ? searchUrls[type](query) : socialMediaUrls[type];
      openPopup(searchUrl);
    }
  }

  // Calculator
  else if (type === 'calculator-open') {
    openPopup('https://www.google.com/search?q=calculator');
  }

  // GOOGLE SEARCH
  else if (type === 'google-search') {
    if (cleanedInput === 'open google' || cleanedInput === 'google') {
      openPopup('https://www.google.com/');
    } else {
      const query = encodeURIComponent(userInput);
      openPopup(`https://www.google.com/search?q=${query}`);
    }
  }

  // YOUTUBE
  else if (type === 'youtube-search') {
    if (cleanedInput === 'open youtube' || cleanedInput === 'youtube') {
      openPopup('https://www.youtube.com/');
    } else {
      const query = encodeURIComponent(userInput);
      openPopup(`https://www.youtube.com/results?search_query=${query}`);
    }
  } else if (type === 'youtube-play') {
    const query = encodeURIComponent(userInput);
    openPopup(`https://www.youtube.com/results?search_query=${query}`);
  }

  // 🔊 Speak response
  speak(response);
};



  useEffect(() => {
    if (!userData?.assistantName) {
      console.log("Waiting for assistant name before starting recognition...");
      return;
    }

    console.log("Assistant name available, starting recognition...");

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'en-US';

    recognitionRef.current = recognition;
    const isRecognizingRef = { current: false };

    const safeRecognition = () => {
      if (!isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start();
          console.log("Recognition requested to start");
        } catch (error) {
          if (error.name !== "InvalidStateError") {
            console.error("Error starting recognition:", error);
          }
        }
      }
    };

    recognition.onstart = () => {
      console.log("recognition started");
      isRecognizingRef.current = true;
      setListening(true);
    };

    recognition.onend = () => {
      console.log("recognition ended");
      isRecognizingRef.current = false;
      setListening(false);
    };

    if (!isSpeakingRef.current) {
      setTimeout(() => {
        safeRecognition();
      }, 1000);
    }

    recognition.onerror = (event) => {
      console.log("Recognition error:", event.error);
      isRecognizingRef.current = false;
      setListening(false);
      if (event.error !== "aborted" && isSpeakingRef.current) {
        setTimeout(() => {
          safeRecognition();
        }, 1000);
      }
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0]?.transcript?.trim();
      const assistantName = userData?.assistantName;

      console.log("🗣️ Heard:", transcript);
      console.log("👤 Assistant name:", assistantName);

      const assistantIncluded = transcript?.toLowerCase().includes(assistantName?.toLowerCase());
      console.log(" Assistant name in transcript?", assistantIncluded);

      recognition.stop();
      isRecognizingRef.current = false;
      setListening(false);

      // Only proceed if all are true, else do nothing (no empty slot)
      if (transcript && assistantName && assistantIncluded) {
        console.log("✅ Assistant name found in transcript. Sending to Gemini.");
        try {
          const data = await getGeminiResponse(transcript);
          console.log("💬 Gemini response:", data);
          if (data) {
            speak(data.response);
            handleCommand(data);
            setTimeout(() => {
              handleCurrentUser();
            }, 1000); // increased delay for DB write
          }
        } catch (error) {
          console.error("❌ Error from Gemini:", error);
        }
      } else {
        console.log("❌ Assistant name not found or transcript invalid. Not saving to history.");
      }
    };

    const fallback = setInterval(()=>{
      if(!isSpeakingRef.current && !isRecognizingRef.current){
        safeRecognition()
      }
    },10000)

    // recognition.start();

    return () => {
      recognition.stop();
      setListening(false)
      isRecognizingRef.current = false
      clearInterval(fallback)
    };
    console.log("🕓 userData.history updated:", userData?.history);
  }, [userData?.assistantName]);

  return ( 
    
      <div className='w-full min-h-screen bg-gradient-to-t from-[black] to-[#030353] flex flex-col items-center justify-center relative'>
      <div className="absolute top-8 right-8 flex gap-4">
        <button
          className="px-6 py-2 bg-white text-black font-semibold rounded-full shadow hover:bg-blue-100 transition duration-200 cursor-pointer"
          onClick={handleLogOut}
        >
          Log Out
        </button>
        <button
          className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-full shadow hover:bg-blue-700 transition duration-200 cursor-pointer"
          onClick={() => navigate('/customize')}
        >
          Customize your Assistant
        </button>
        </div>
        
      {userData?.assistantImage && (
        <img
          src={userData.assistantImage}
          alt="Assistant"
          className="w-[350px] h-[450px] rounded-4xl shadow-2xl shadow-blue-500 object-cover mb-8"
        />
      )}
      <h1 className='text-white text-center text-[30px] font-semibold mb-[30px]'>I'm <span className='text-blue-200'>{userData?.assistantName}</span></h1>
      <div className="flex justify-center mb-8">
        {isSpeaking ? (
          <img src={aiGif} alt="AI Speaking" className="w-[160px] h-[160px] rounded-full object-cover shadow-lg" />
        ) : (
          <img src={userGif} alt="User" className="w-[160px] h-[160px] rounded-full object-cover shadow-lg" />
        )}
      </div>
       
    </div>
    
  )
}

export default Home