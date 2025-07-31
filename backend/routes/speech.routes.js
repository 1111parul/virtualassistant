// import express from "express";
// import axios from "axios";
// import isAuth from "../middlewares/isAuth.js";
// import FormData from "form-data";
// import multer from "multer";


// const router = express.Router();
// const upload = multer();


// router.post("/process", isAuth, async (req, res) => {
//   try {
//     if (!req.files || !req.files.audio) {
//       return res.status(400).json({ error: "No audio file uploaded" });
//     }

//     const audioFile = req.files.audio;
//     const formData = new FormData();
//     formData.append("audio", audioFile.data, {
//       filename: audioFile.name,
//       contentType: audioFile.mimetype,
//     });

//     const pythonResponse = await axios.post(
//       "http://localhost:5001/process-audio",
//       formData,
//       {
//         headers: formData.getHeaders(),
//       }
//     );

//     res.json(pythonResponse.data);
//   } catch (error) {
//     console.error("Error forwarding audio:", error.message);
//     res.status(500).json({ error: "Error connecting to AI assistant" });
//   }
// });

// export default router;



import express from "express";
import multer from "multer";
import axios from "axios";
import isAuth from "../middlewares/isAuth.js";
import FormData from "form-data";

const router = express.Router();
const upload = multer();

// Handles POST /api/speech/process with audio upload
router.post("/process", isAuth, upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file uploaded" });
    }

    // Prepare FormData for forwarding to Python server
    const formData = new FormData();
    formData.append("audio", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    // Send audio to Python server for processing
    const pythonResponse = await axios.post(
      "http://localhost:5001/process-audio",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          "Access-Control-Allow-Origin": "*",
        },
      }
    );

    // Return the Python server response
    res.json(pythonResponse.data);
  } catch (error) {
    console.error("Error processing audio:", error.message);
    res.status(500).json({ error: "Error processing audio" });
  }
});

export default router;