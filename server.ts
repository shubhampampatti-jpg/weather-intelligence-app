import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API route for getting Gemini insights on weather
  app.post("/api/insights", async (req, res) => {
    try {
      const { weatherData, locationName } = req.body;
      
      const key = process.env.GEMINI_API_KEY;
      if (!key) {
        return res.status(500).json({ error: "GEMINI_API_KEY environment variable is missing" });
      }

      const ai = new GoogleGenAI({ apiKey: key });

      const prompt = `You are a helpful AI weather assistant for the Weather Intelligence App.
A user in ${locationName} is asking for insights based on the current weather and forecast.
Here is the weather data:
${JSON.stringify(weatherData, null, 2)}

Provide a concise, helpful summary of the weather.
Include:
1. A brief 1-2 sentence overview of the current conditions and the upcoming forecast.
2. 2-3 specific, actionable recommendations (e.g., clothing, activities, things to watch out for).
Format your response in simple Markdown, using bullet points for recommendations. Do not use generic pleasantries, just get straight to the insights.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      res.json({ insights: response.text });
    } catch (error) {
      console.error("Error generating insights:", error);
      res.status(500).json({ error: "Failed to generate insights" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
