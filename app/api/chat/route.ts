import { OpenAI } from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "",
});

export async function POST(req: Request) {
    const { messages } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
        return new Response(JSON.stringify({ error: "Missing OpenAI API Key" }), {
            status: 500,
        });
    }

    try {
        const stream = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content:
                        "You are a helpful AI Avatar language tutor. You help users learn languages or topics. Keep your responses concise and conversational. You are talking to the user face-to-face.",
                },
                ...messages,
            ],
            stream: true,
        });

        // Create a readable stream for the response
        const encoder = new TextEncoder();
        const readableStream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of stream) {
                        const content = chunk.choices[0]?.delta?.content || "";
                        if (content) {
                            controller.enqueue(encoder.encode(content));
                        }
                    }
                    controller.close();
                } catch (error) {
                    controller.error(error);
                }
            },
        });

        return new Response(readableStream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Transfer-Encoding": "chunked",
            },
        });
    } catch (error: any) {
        console.error("Error processing request:", error);
        return new Response(JSON.stringify({ error: error.message || "Error processing request" }), {
            status: 500,
        });
    }
}
