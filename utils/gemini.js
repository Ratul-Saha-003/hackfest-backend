require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getHashtags(event) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro-preview-03-25" });
  
    const prompt = `
    Generate a list of relevant hashtags for an event with the following details:
    - Name: ${event.name}
    - Description: ${event.description}
    - Location: ${event.location}
    - Date: ${event.date}
    
    Return only a JSON array of hashtags, like:
    ["#TechEvent", "#Innovation", "#StartupConference"]
    `;
  
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
  
      return JSON.parse(text); // Convert response to an array
    } catch (error) {
      console.error("Error generating hashtags:", error);
      return [];
    }
  }

module.exports = getHashtags
  