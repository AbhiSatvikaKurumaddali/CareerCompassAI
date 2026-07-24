/**
 * aiProvider.js
 * ---------------------------------------------------------------------------
 * A thin, pluggable abstraction over "an AI text completion call".
 *
 * By default (AI_PROVIDER=mock), CareerCompass AI does NOT call any external
 * AI API. All agents fall back to deterministic, rule-based logic driven by
 * the JSON datasets in /data. This keeps the app fully functional offline
 * and free of API-key requirements.
 *
 * Groq (https://console.groq.com) is supported out of the box — it's free-tier
 * friendly and OpenAI-compatible, so no extra npm package is needed (uses the
 * built-in `fetch`, available in Node 18+). Set AI_PROVIDER=groq + GROQ_API_KEY
 * in .env to enable it. OpenAI and Ollama stubs are also included if you want
 * to switch later.
 *
 * Every agent calls `generateCompletion(prompt)` — swapping the provider here
 * upgrades every agent at once without touching their logic.
 * ---------------------------------------------------------------------------
 */

const PROVIDER = process.env.AI_PROVIDER || "mock";

/**
 * generateCompletion
 * @param {string} prompt - the instruction/context to send to the model
 * @returns {Promise<string|null>} the model's text response, or null to
 *   signal "no AI available — use rule-based logic instead"
 *
 * NOTE: Agents are written so that if this ever throws or returns null,
 * they gracefully fall back to their built-in rule-based logic — the app
 * never breaks due to a missing/invalid API key.
 */
async function generateCompletion(prompt) {
  switch (PROVIDER) {
    case "groq": {
      if (!process.env.GROQ_API_KEY) {
        throw new Error("GROQ_API_KEY is not set. Falling back to rule-based logic.");
      }

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content:
                "You are the AI assistant inside CareerCompass AI, a career guidance platform. " +
                "Be concise, practical, and encouraging. Keep answers under 120 words unless asked for detail.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.6,
          max_tokens: 400,
        }),
      });

      if (!response.ok) {
        const errText = await response.text().catch(() => "");
        throw new Error(`Groq API error (${response.status}): ${errText}`);
      }

      const data = await response.json();
      return data?.choices?.[0]?.message?.content?.trim() || null;
    }

    case "openai": {
      // Example implementation (requires `openai` package + OPENAI_API_KEY):
      //
      // const OpenAI = require("openai");
      // const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      // const res = await client.chat.completions.create({
      //   model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      //   messages: [{ role: "user", content: prompt }],
      // });
      // return res.choices[0].message.content;
      throw new Error("OpenAI provider not configured. Falling back to rule-based logic.");
    }

    case "ollama": {
      // Example implementation (requires local Ollama running):
      //
      // const res = await fetch(`${process.env.OLLAMA_BASE_URL}/api/generate`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ model: process.env.OLLAMA_MODEL || "llama3", prompt, stream: false }),
      // });
      // const data = await res.json();
      // return data.response;
      throw new Error("Ollama provider not configured. Falling back to rule-based logic.");
    }

    case "mock":
    default:
      // No external call — signal agents to use rule-based logic.
      return null;
  }
}

module.exports = { generateCompletion, PROVIDER };
