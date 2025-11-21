import { OpenAI } from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "",
});

export async function POST(req: Request) {
    if (!process.env.OPENAI_API_KEY) {
        return new Response(JSON.stringify({ error: "Missing OpenAI API Key" }), {
            status: 500,
        });
    }

    try {
        const formData = await req.formData();
        const audioFile = formData.get("audio") as File;

        if (!audioFile) {
            return new Response(JSON.stringify({ error: "No audio file provided" }), {
                status: 400,
            });
        }

        console.log("Transcribing audio file:", audioFile.name, "Size:", audioFile.size);

        const transcription = await openai.audio.transcriptions.create({
            file: audioFile,
            model: "whisper-1",
            language: "en", // You can make this dynamic or auto-detect
        });

        console.log("Transcription result:", transcription.text);

        return new Response(JSON.stringify({ text: transcription.text }), {
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error: any) {
        console.error("Error transcribing audio:", error);
        return new Response(JSON.stringify({ error: error.message || "Error transcribing audio" }), {
            status: 500,
        });
    }
}

