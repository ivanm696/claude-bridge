import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY_2,
})

export async function POST(request: Request) {
  try {
    const { messages } = await request.json()

    const response = await client.messages.create({
      model: 'claude-3-7-sonnet-20250219',
      max_tokens: 16000,
      messages,
      thinking: {
        type: 'adaptive',
        budget_tokens: 10000,
      },
    } as any)

    return Response.json(response)
  } catch (error: any) {
    console.error('[v0] Claude API error:', error.message || error)
    
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
          error: 'Invalid Anthropic API key. Check your ANTHROPIC_API_KEY_2 environment variable.',
          type: 'invalid_api_key'
        },
        { status: 401 }
      )
    }

    if (error.message?.includes('model') || error.message?.includes('not found')) {
      return Response.json(
        { 
          error: `Model error: ${error.message}. Please check the model name.`,
          type: 'model_error'
        },
        { status: 400 }
      )
    }
    
    return Response.json(
      { error: `Error: ${error.message || 'Failed to get response from Claude'}` },
      { status: 500 }
    )
  }
}
