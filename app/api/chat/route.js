import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { messages } = await request.json()

    const systemPrompt = `You are an AI assistant helping teachers create effective assignment instructions for Vada, a Socratic AI tutor.

Your role is to help teachers craft instructions that:
- Guide Vada to use Socratic questioning rather than giving direct answers
- Specify the learning objectives and key concepts
- Define appropriate scaffolding for the student's level
- Set boundaries on what Vada should/shouldn't explain directly
- Encourage critical thinking and problem-solving

When a teacher describes their assignment, help them write clear, pedagogically sound instructions that Vada can use as a system prompt.

Be concise, practical, and focused on helping teachers create better learning experiences.`

    const response = await fetch('https://models.inference.ai.azure.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        model: 'gpt-4o',
        temperature: 0.7,
        max_tokens: 800,
      }),
    })

    if (!response.ok) {
      throw new Error('API request failed')
    }

    cons
