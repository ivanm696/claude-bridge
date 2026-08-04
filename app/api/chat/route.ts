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
        model: 'claude-opus-5',
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
        { error: errorData.error || 'Failed to get response from Claude' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return Response.json(data)
  } catch (error: any) {
    console.error('[v0] Claude API error:', error.message || error)
    return Response.json(
      { error: `Error: ${error.message || 'Failed to get response from Claude'}` },
      { status: 500 }
    )
  }
}
