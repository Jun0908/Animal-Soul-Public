// app/api/speak/route.ts
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs"; // Buffer を使うので Node 実行を明示

type SpeakRequestBody = {
  text: string;
  voiceType: "dog" | "parrot";
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SpeakRequestBody;
    const { text, voiceType } = body;

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Text is required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "ELEVENLABS_API_KEY is not set on the server." },
        { status: 500 }
      );
    }

    const modelId =
      process.env.ELEVENLABS_MODEL_ID ?? "eleven_multilingual_v2";

    const voiceId =
      voiceType === "parrot"
        ? process.env.ELEVENLABS_PARROT_VOICE_ID
        : process.env.ELEVENLABS_DOG_VOICE_ID;

    if (!voiceId) {
      return NextResponse.json(
        {
          error: `Voice ID for ${voiceType} is not configured. Check ELEVENLABS_${voiceType.toUpperCase()}_VOICE_ID.`,
        },
        { status: 500 }
      );
    }

    // ElevenLabs Text-to-Speech API
    const ttsRes = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
          // 返ってくる audio の形式（MP3想定）
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: modelId,
          // ここで「おうむ寄り」「犬寄り」の感じを調整してもOK
          voice_settings: {
            stability: 0.4,
            similarity_boost: 0.8,
            style: voiceType === "parrot" ? 0.9 : 0.7,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!ttsRes.ok) {
      const errorText = await ttsRes.text().catch(() => "");
      console.error("ElevenLabs TTS error:", ttsRes.status, errorText);

      return NextResponse.json(
        {
          error: "Failed to generate speech from ElevenLabs.",
          detail: errorText,
        },
        { status: 502 }
      );
    }

    const arrayBuffer = await ttsRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Audio = buffer.toString("base64");

    // data URL として返す（フロントはそのまま <audio src="..."> でOK）
    const audioUrl = `data:audio/mpeg;base64,${base64Audio}`;

    return NextResponse.json(
      {
        audioUrl,
        transcript: text,
        voiceType,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in /api/speak:", err);
    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}
