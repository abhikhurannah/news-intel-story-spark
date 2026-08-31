import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are an expert business intelligence analyst. Given an article's text, generate a structured briefing in JSON format.

Return ONLY valid JSON with this exact structure:
{
  "title": "concise headline interpretation",
  "summary": "5-line executive summary paragraph",
  "timeline": [{"date": "timeframe", "event": "what happened"}],
  "entities": [{"name": "entity name", "type": "company|person|org", "role": "brief role description"}],
  "keyNumbers": [{"value": "the number/stat", "label": "short label", "context": "why it matters"}],
  "bullish": ["positive perspective 1", "positive perspective 2", ...],
  "bearish": ["risk/concern 1", "risk/concern 2", ...],
  "watchNext": ["what to monitor 1", "what to monitor 2", ...],
  "whyItMatters": "2-3 sentence analysis of broader significance"
}

Guidelines:
- Timeline: 4-6 events in chronological order
- Entities: 4-6 key players (companies, people, organizations)
- Key Numbers: 3-5 important statistics/figures from the article
- Bullish/Bearish: 3-4 points each
- Watch Next: 4-5 forward-looking items
- Use only facts stated in the article text. Do not infer, complete missing facts, or invent statistics.
- If the article does not contain the requested information, use "Not stated in source".
- Keep claims attributable to the supplied article; do not present model knowledge as article evidence.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { articleText, articleTitle, articleSource } = await req.json();
    if (typeof articleText !== "string" || articleText.trim().length === 0) {
      return new Response(JSON.stringify({ error: "articleText is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (articleText.length > 250_000) {
      return new Response(JSON.stringify({ error: "articleText exceeds the allowed size" }), {
        status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // Truncate article to ~12k tokens worth of text
    const truncated = articleText.slice(0, 50000);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Article title: ${articleTitle || "Unknown"}\nSource: ${articleSource || "Unknown"}\n\nArticle content:\n${truncated}` },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits in Settings." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "AI generation failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Extract JSON from response (might be wrapped in markdown code block)
    let jsonStr = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) jsonStr = jsonMatch[1];

    try {
      const briefing = JSON.parse(jsonStr.trim());
      const requiredFields = ["title", "summary", "timeline", "entities", "keyNumbers", "bullish", "bearish", "watchNext", "whyItMatters"];
      if (!requiredFields.every((field) => field in briefing)) throw new Error("Model response has an invalid briefing schema");
      if (![briefing.timeline, briefing.entities, briefing.keyNumbers, briefing.bullish, briefing.bearish, briefing.watchNext].every(Array.isArray)) {
        throw new Error("Model response has invalid briefing collections");
      }
      // Add metadata
      briefing.source = articleSource || "Unknown";
      briefing.publishedAt = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
      briefing.id = crypto.randomUUID();

      return new Response(JSON.stringify({ success: true, briefing }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (parseErr) {
      console.error("JSON parse error:", parseErr, "Content:", content.slice(0, 500));
      return new Response(JSON.stringify({ error: "Failed to parse AI response" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (e) {
    console.error("generate-briefing error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
