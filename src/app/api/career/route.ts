import { Groq } from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  const { academicData, interests, skills } = await req.json();

  try {
    const stream = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a career guidance expert. Analyze this student profile:
            Academic: ${academicData}
            Interests: ${interests}
            Skills: ${skills}
            
            Provide recommendations in markdown format with these sections:
            ## Career Paths
            - List 3-5 relevant roles
            
            ## Recommended Courses
            - Links to courses using [Name](URL) format
            
            ## Skill Development
            - Actionable steps with specific technologies
            
            Use proper markdown formatting without code blocks.`,
        },
      ],
      model: "mixtral-8x7b-32768",
      stream: true,
      temperature: 0.7,
    });

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || "";
          controller.enqueue(encoder.encode(content));
        }
        controller.close();
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
