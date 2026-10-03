import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)
    const messages = Array.isArray(body?.messages) ? body.messages : []

    if (!messages.length) {
      return NextResponse.json(
        { error: 'No messages provided.', type: 'invalid_request' },
        { status: 400 }
      )
    }

    const apiKey = process.env.COMETAPI_KEY?.trim()
    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'COMETAPI_KEY is missing. Set it in your environment variables before calling the API.',
          type: 'missing_api_key',
        },
        { status: 500 }
      )
    }

    const response = await fetch('https://api.cometapi.com/v1/messages', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
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

    let responseData: any = {}
    try {
      responseData = await response.json()
    } catch {
      responseData = {}
    }

    if (!response.ok) {
      console.error('[v0] CometAPI error:', response.status, responseData)

      const errorMessage =
        typeof responseData?.error === 'string'
          ? responseData.error
          : responseData?.error?.message ||
            responseData?.message ||
            'Failed to get response from Claude'

      if (response.status === 401) {
        return NextResponse.json(
          {
            error: 'Invalid CometAPI key. Check your COMETAPI_KEY environment variable.',
            type: 'invalid_api_key',
          },
          { status: 401 }
        )
      }

      if (response.status === 429) {
        return NextResponse.json(
          {
            error: 'Rate limit exceeded. Please wait a moment and try again.',
            type: 'rate_limit',
          },
          { status: 429 }
        )
      }

      return NextResponse.json({ error: errorMessage }, { status: response.status })
    }

    if (!responseData || !Array.isArray(responseData.content)) {
      return NextResponse.json(
        {
          error: 'Invalid response format from CometAPI.',
          type: 'invalid_response',
        },
        { status: 502 }
      )
    }

    return NextResponse.json(responseData)
  } catch (error: any) {
    console.error('[v0] Claude API error:', error?.message || error)
    return NextResponse.json(
      { error: error?.message || 'Failed to get response from Claude' },
      { status: 500 }
    )
  }
}
