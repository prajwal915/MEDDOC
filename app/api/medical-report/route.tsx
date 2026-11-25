import { db } from "@/config/db";
import { openai } from "@/config/OpenAiModel";
import { SessionChatTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const REPORT_GEN_PROMPT = `You are an AI Medical Voice Agent that just finished a voice conversation with a patient.
Analyze the full conversation and generate a structured medical report.

EXTRACTION RULES:
- "user": Extract the patient's actual name if they introduced themselves (e.g. "I'm John", "My name is Sarah"). If no name was given, use "Anonymous"
- "agent": Use the doctor/specialist name from the AI Doctor Agent Info provided
- "chiefComplaint": The patient's main health problem in their own words
- "symptoms": Every symptom the patient mentioned (fever, headache, nausea, etc.)
- "duration": How long they have had the symptoms (e.g. "3 days", "2 weeks"). Use "Not mentioned" if unknown
- "severity": Rate as exactly one of: "mild", "moderate", or "severe" based on symptoms described
- "medicationsMentioned": ANY medicine discussed — current meds, suggested meds, over-the-counter drugs. Use [] if none.
- "recommendations": Give SPECIFIC actionable advice based on the ACTUAL symptoms discussed.
  BAD example: "Stay hydrated" (too generic)
  GOOD example: "Take Paracetamol 500mg every 6 hours for fever, do not exceed 4 doses per day"
  Always include at least 3 specific recommendations tied to what the patient described.
- "summary": 2-3 sentence summary of the consultation

STRICT RULES:
- Never return null for any field
- Use [] for empty arrays, "Not mentioned" for unknown strings
- Base ALL recommendations on the actual symptoms discussed, never give generic placeholder advice
- Respond with ONLY the raw JSON object — no markdown, no backticks, no extra text

Return ONLY this JSON structure:
{
  "sessionId": "string",
  "agent": "string",
  "user": "string",
  "timestamp": "ISO Date string",
  "chiefComplaint": "string",
  "summary": "string",
  "symptoms": ["symptom1", "symptom2"],
  "duration": "string",
  "severity": "string",
  "medicationsMentioned": ["med1", "med2"],
  "recommendations": ["specific rec1", "specific rec2", "specific rec3"]
}`;

export async function POST(req: NextRequest) {
  const { sessionId, sessionDetail, messages } = await req.json();

  if (!sessionId || !sessionDetail || !messages) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const userInput =
    "AI Doctor Agent Info: " +
    JSON.stringify(sessionDetail) +
    "\n\nConversation Transcript:\n" +
    messages
      .map((m: { role: string; text: string }) => `${m.role.toUpperCase()}: ${m.text}`)
      .join("\n");

  try {
    const completion = await openai.chat.completions.create({
      model: "nvidia/nemotron-3-super-120b-a12b:free",
      messages: [
        { role: "system", content: REPORT_GEN_PROMPT },
        { role: "user", content: userInput },
      ],
    });

    const rawResp = completion.choices[0].message?.content || "";

    let jsonResp;
    try {
      const cleaned = rawResp
        .trim()
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();
      jsonResp = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse AI response:", rawResp);
      return NextResponse.json(
        { error: "Failed to parse AI response", raw: rawResp },
        { status: 500 }
      );
    }

    await db
      .update(SessionChatTable)
      .set({
        report: JSON.stringify(jsonResp),
        conversation: JSON.stringify(messages),
      })
      .where(eq(SessionChatTable.sessionId, sessionId));

    const updated = await db
      .select()
      .from(SessionChatTable)
      .where(eq(SessionChatTable.sessionId, sessionId));

    if (!updated.length) {
      return NextResponse.json(
        { error: `No session found with sessionId: ${sessionId}` },
        { status: 404 }
      );
    }

    return NextResponse.json(jsonResp);

  } catch (e: any) {
    console.error("Report generation error:", e);
    return NextResponse.json(
      { error: "Internal server error", details: e?.message || String(e) },
      { status: 500 }
    );
  }
}