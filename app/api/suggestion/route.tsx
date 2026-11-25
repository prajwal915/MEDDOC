import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/config/OpenAiModel";
import { AIDoctorAgents } from "@/shared/list";

export async function POST(req: NextRequest) {
  const { notes } = await req.json();

  try {
    const completion = await openai.chat.completions.create({
      model: "nvidia/nemotron-3-super-120b-a12b:free",
      messages: [
        {
          role: "system",
          content: JSON.stringify(AIDoctorAgents),
        },
        {
          role: "user",
          content:
            "User Notes/Symptoms: " +notes +
            ", Based on symptoms, suggest list of doctors. Return JSON only.",
        },
      ],
    });

    const rawResp = completion.choices[0].message?.content || "";

    let JSONResp;
    try {
      const cleaned = rawResp
        .trim()
        .replace(/```json/g, "")
        .replace(/```/g, "");

      JSONResp = JSON.parse(cleaned);
    } catch {
      JSONResp = { text: rawResp };
    }

    return NextResponse.json(JSONResp);

  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}