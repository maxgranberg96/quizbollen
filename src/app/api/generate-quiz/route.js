import { OpenAI } from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req) {
  const { topic, count } = await req.json();
  const prompt = `
Generera ett JSON‐objekt för ett quiz under ämnet "${topic}". 
Inkludera ${count} frågor. 
Formatet ska vara:
{
  "title": "...",
  "description": "...",
  "category": "...",
  "questions": [
    {
      "text": "...",
      "options": [
        { "text": "...", "is_correct": true|false },
        ...
      ]
    },
    ...
  ]
}
  
Var noggrann: varje fråga ska ha minst 2 och max 4 alternativ, exakt ett korrekt.  
`;

  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.8
  });

  try {
    const json = JSON.parse(res.choices[0].message.content);
    return NextResponse.json(json);
  } catch (e) {
    return NextResponse.json({ error: "Kunde inte parsa AI-svaret" }, { status: 500 });
  }
}
