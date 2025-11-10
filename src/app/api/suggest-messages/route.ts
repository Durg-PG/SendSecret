import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead onuniversal themes that encourage friendly interaction. For example, your output should be structured like this:'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?|| What's a simple thing that makes you happy?. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment"

    const result = await streamText({
      model: openai('gpt-3.5-turbo-instruct'),
      prompt: prompt,
      temperature: 0.7, // Add some creativity but maintain coherence
      maxOutputTokens: 400, // Limit the response length
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    if (error instanceof OpenAI.APIError ) {
        const {name, status, headers, message} = error
        return NextResponse.json({
            name,status,headers,message
        },{status: status})
    } else {
        console.error("An unexpected error has occuered", error)
        throw error
    }
  }
}