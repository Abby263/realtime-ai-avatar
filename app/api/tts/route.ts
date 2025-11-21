import { OpenAI } from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "",
});

export async function POST(req: Request) {
    const { text } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
        return new Response(JSON.stringify({ error: "Missing OpenAI API Key" }), {
            status: 500,
        });
    }

    try {
        const mp3 = await openai.audio.speech.create({
            model: "tts-1",
            voice: "alloy",
            input: text,
        });

        const buffer = Buffer.from(await mp3.arrayBuffer());

        return new Response(buffer, {
            headers: {
                "Content-Type": "audio/mpeg",
            },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: "Error generating speech" }), {
            status: 500,
        });
    }
}
