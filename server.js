import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" }));

// GEMINI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// ------------------ GENERATE ------------------
app.post("/generate", async (req, res) => {
  try {
    const { prompt, images } = req.body;

    const parts = [
      { text: `Gere um site completo baseado em: ${prompt}.  
      - HTML completo  
      - CSS no <style>  
      - JS no <script>  
      - Não explique nada  
      - Não corte conteúdo` }
    ];

    if (Array.isArray(images)) {
      images.forEach(img => {
        parts.push({
          inlineData: {
            data: img.split("base64,")[1],
            mimeType: "image/png",
          }
        });
      });
    }

    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 8000
      }
    });

    res.json({ result: result.response.text() });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao gerar" });
  }
});

// ------------------ EDIT ------------------
app.post("/edit", async (req, res) => {
  try {
    const { prompt, currentHTML } = req.body;

    const finalPrompt = `
      HTML atual:
      ${currentHTML}

      Mudanças solicitadas:
      ${prompt}

      Regras:
      - Mantenha a estrutura existente
      - Aplique apenas as mudanças necessárias
      - Não explique nada
      - Retorne somente HTML
    `;

    const result = await model.generateContent(finalPrompt);

    res.json({ result: result.response.text() });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao editar" });
  }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend rodando na porta ${PORT}`);
});



