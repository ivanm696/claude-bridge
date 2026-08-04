import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { messages } = await request.json()

    const response = await client.messages.create({
      model: 'claude-opus-5',
      max_tokens: 20000,
      messages,
      thinking: {
        type: 'adaptive',
      },
    })

    return Response.json(response)
  } catch (error) {
    console.error('Claude API error:', error)
    return Response.json(
      { error: 'Failed to get response from Claude' },
      { status: 500 }
    )
  }
}
