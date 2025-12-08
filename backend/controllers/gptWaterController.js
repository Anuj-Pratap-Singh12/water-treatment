// backend/controllers/gptWaterController.js
require("dotenv").config();
const { OpenAI } = require("openai");

// Create OpenAI client (will only be used if key exists)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 🔧 Random mock generator (your logic, wrapped in a helper)
function generateMockWaterData(sourceReason = "Mock-Data (Fallback generator)") {
  const mock = {
    ph: Number((6.2 + Math.random() * 1.5).toFixed(2)),
    tds: 900 + Math.floor(Math.random() * 1000),
    turbidity: 80 + Math.floor(Math.random() * 120),
    bod: 120 + Math.floor(Math.random() * 260),
    cod: 250 + Math.floor(Math.random() * 350),
    tn: 15 + Math.floor(Math.random() * 50),
    temperature: 17 + Math.floor(Math.random() * 12),
    flow: 450 + Math.floor(Math.random() * 1400),
    totalVolume: 600000 + Math.floor(Math.random() * 600000),
    heavyMetals: Math.random() < 0.3,
  };

  return {
    ...mock,
    source: sourceReason,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Generate realistic wastewater sensor data using GPT
 * Falls back to random generator if key not set or credits over
 */
async function getGptWaterData(req, res) {
  // 1️⃣ If there is NO key at all → directly use generator
  if (!process.env.OPENAI_API_KEY) {
    console.warn(
      "[GPT Water] OPENAI_API_KEY not configured. Using mock generator."
    );
    return res.json(
      generateMockWaterData("Mock-Data (No OPENAI_API_KEY configured)")
    );
  }

  try {
    const prompt = `You are a water treatment facility IoT sensor simulator. Generate realistic wastewater quality sensor readings in JSON format.

Return ONLY valid JSON with no markdown formatting or extra text. Include these exact fields:
{
  "ph": <number between 4.0 and 10.0>,
  "tds": <number between 800 and 3000 in mg/L>,
  "turbidity": <number between 10 and 300 in NTU>,
  "bod": <number between 100 and 600 in mg/L (Biochemical Oxygen Demand)>,
  "cod": <number between 200 and 1200 in mg/L (Chemical Oxygen Demand)>,
  "tn": <number between 20 and 100 in mg/L (Total Nitrogen)>,
  "temperature": <number between 15 and 35 in Celsius>,
  "flow": <number between 500 and 2000 in m³/day>,
  "totalVolume": <number between 500000 and 2000000 in L/day>,
  "heavyMetals": <boolean, true if heavy metals detected>
}

The values should be interdependent and realistic for a wastewater treatment facility. Higher turbidity often correlates with higher BOD and COD.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // Extract text from OpenAI response
    const responseText = completion.choices[0].message.content;

    // Parse JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse JSON from GPT response");
    }

    const waterData = JSON.parse(jsonMatch[0]);

    // Validate all required fields are present and are numbers
    const requiredFields = [
      "ph",
      "tds",
      "turbidity",
      "bod",
      "cod",
      "tn",
      "temperature",
      "flow",
      "totalVolume",
    ];

    for (const field of requiredFields) {
      if (typeof waterData[field] !== "number") {
        throw new Error(`Invalid or missing field: ${field}`);
      }
    }

    if (typeof waterData.heavyMetals !== "boolean") {
      waterData.heavyMetals = false;
    }

    // ✅ Return GPT-generated data
    return res.json({
      ...waterData,
      source: "GPT-Generated",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("GPT Water Data Generation Error:", err);

    // 2️⃣ If credits over / key invalid / any GPT error → use your generator
    console.log("OpenAI Error → Using mock data generator.");

    // Optional: detect quota error specifically for message
    const isQuotaError =
      err?.code === "insufficient_quota" ||
      err?.status === 429 ||
      err?.error?.code === "insufficient_quota" ||
      (typeof err.message === "string" &&
        (err.message.includes("insufficient_quota") ||
          err.message.includes("You exceeded your current quota")));

    const reason = isQuotaError
      ? "Mock-Data (Add OpenAI credits to use real API)"
      : "Mock-Data (OpenAI error fallback)";

    return res.json(generateMockWaterData(reason));
  }
}

module.exports = { getGptWaterData };
