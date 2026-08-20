export async function POST(request: Request) {
  try {
    const { messages } = await request.json()

    const response = await fetch('https://api.cometapi.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': process.env.COMETAPI_KEY || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-8',
        max_tokens: 16000,
        messages,
        thinking: {
          type: 'adaptive',
          budget_tokens: 10000,
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('[v0] CometAPI error:', response.status, errorData)

      // Anthropic-style errors look like: { type: 'error', error: { type: '...', message: '...' } }
      // errorData.error can be an OBJECT, not a string — always resolve to a plain string here.
      const errorMessage =
        typeof errorData.error === 'string'
          ? errorData.error
          : errorData.error?.message || errorData.message || 'Failed to get response from Claude'

      if (response.status === 401) {
        return Response.json(
          {
            error: 'Invalid CometAPI key. Check your COMETAPI_KEY environment variable.',
            type: 'invalid_api_key',
          },
          { status: 401 }
        )
      }

      if (response.status === 429) {
        return Response.json(
          {
            error: 'Rate limit exceeded. Please wait a moment and try again.',
            type: 'rate_limit',
          },
          { status: 429 }
        )
      }

      return Response.json(
        { error: errorMessage },
        { status: response.status }
      )
    }

    const data = await response.json()
    return Response.json(data)
  } catch (error: any) {
    console.error('[v0] Claude API error:', error.message || error)
    return Response.json(
      { error: error.message || 'Failed to get response from Claude' },
      { status: 500 }
    )
  }
}
