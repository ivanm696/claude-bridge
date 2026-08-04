# Claude AI Chat - Extended Thinking

A beautiful web app that lets you chat with Claude while seeing its extended thinking process in action. Built with Next.js and powered by CometAPI for reliable Claude access.

## Features

- **Chat Interface**: Clean, modern conversation UI with real-time responses
- **Extended Thinking**: View Claude's complete reasoning process alongside responses
- **CometAPI Integration**: Reliable proxy service - no credit balance worries
- **Error Handling**: Clear error messages and helpful guidance for API issues
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Keyboard Shortcuts**: Shift+Enter for new lines, Enter to send

## Setup

### 1. Get Your CometAPI Key

1. Visit [CometAPI Console](https://www.cometapi.com/console/token)
2. Sign up or log in to your account
3. Copy your API key

### 2. Add Your API Key

In your project settings:

1. Go to Settings (⚙️) in the top right
2. Click **Vars**
3. Add `COMETAPI_KEY` with your API key value

### 3. Run the App

```bash
pnpm install
pnpm dev
```

Visit `http://localhost:3000` to start chatting!

## Usage

1. **Type your message** in the input field at the bottom
2. **Press Enter** or click the send button
3. Claude will respond with extended thinking enabled
4. **Click "Thinking Process"** to expand/collapse Claude's reasoning
5. **Use Shift+Enter** to add line breaks in your message

## How It Works

- **Client**: The Next.js React component handles the chat UI and message rendering
- **API Route**: `/api/chat` securely calls the Anthropic API from the backend
- **Extended Thinking**: Enabled via the `"adaptive"` thinking type, which lets Claude decide when deep reasoning is needed
- **Message Display**: The app separates Claude's thinking content from its final response for better UX

## API Reference

### POST /api/chat

Sends a message to Claude and receives a response with extended thinking enabled.

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "Your question here" },
    { "role": "assistant", "content": "Previous response" }
  ]
}
```

**Response:**
```json
{
  "content": [
    { "type": "thinking", "thinking": "Claude's reasoning..." },
    { "type": "text", "text": "Claude's response..." }
  ]
}
```

## Troubleshooting

### "Invalid CometAPI key" error
- Verify your key at [CometAPI Console](https://www.cometapi.com/console/token)
- Make sure `COMETAPI_KEY` is set correctly in project Vars
- Check that the key hasn't expired

### "Rate limit exceeded" error
- Wait a moment and try again
- CometAPI may have rate limits on free tier
- Upgrade your plan for higher limits

### No response from Claude
- Check your internet connection
- Make sure the `COMETAPI_KEY` is correctly set in environment variables
- Check the browser console for error messages
- Try a simpler question first

## How It Works

1. **Frontend**: React chat component handles user interface and message display
2. **API Route**: `/api/chat` endpoint makes requests to CometAPI
3. **CometAPI**: Proxy service that handles Claude API communication
4. **Extended Thinking**: Claude's reasoning process is captured and displayed separately from the final response

## Tech Stack

- **Next.js 16** - React framework with API routes
- **TypeScript** - Type-safe code
- **Tailwind CSS** - Styling
- **CometAPI** - Claude API proxy service
- **lucide-react** - Icons

## Project Structure

```
├── app/
│   ├── page.tsx              # Main page
│   ├── layout.tsx            # Root layout
│   ├── api/chat/route.ts     # Claude API endpoint
│   └── globals.css           # Global styles
├── components/
│   └── chat-interface.tsx    # Chat UI component
└── README.md                 # This file
```

## License

MIT
