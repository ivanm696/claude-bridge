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
  } catch (error: any) {
    console.error('Claude API error:', error)
    
    // Handle specific error types
    if (error.status === 400 && error.error?.message?.includes('credit')) {
      return Response.json(
        { 
          error: 'Insufficient credits on Anthropic API account. Please add credits at https://console.anthropic.com/account/billing/overview',
          type: 'insufficient_credits'
        },
        { status: 400 }
      )
    }
    
    if (error.status === 401) {
      return Response.json(
        { 
          error: 'Invalid Anthropic API key. Check your ANTHROPIC_API_KEY environment variable.',
          type: 'invalid_api_key'
        },
        { status: 401 }
      )
    }
    
    return Response.json(
      { error: 'Failed to get response from Claude. Please try again.' },
      { status: 500 }
    )
  }
}
