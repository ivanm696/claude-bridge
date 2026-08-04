# Claude AI Chat - Extended Thinking

A beautiful web app that lets you chat with Claude while seeing its extended thinking process in action. Built with Next.js and the Anthropic SDK.

## Features

- **Chat Interface**: Clean, modern conversation UI with real-time responses
- **Extended Thinking**: View Claude's complete reasoning process alongside responses
- **Collapsible Thinking**: Toggle the thinking section to see or hide Claude's internal reasoning
- **Error Handling**: Clear error messages and helpful guidance for API issues
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Setup

### 1. Get an Anthropic API Key

1. Go to [Anthropic Console](https://console.anthropic.com)
2. Sign up or log in
3. Navigate to **API Keys** in your account settings
4. Create a new API key
5. Make sure your account has sufficient credits for the API

### 2. Add Your API Key

The `ANTHROPIC_API_KEY` environment variable is already configured in your project. You just need to set its value:

1. Go to your project settings (top right)
2. Click **Vars**
3. Find `ANTHROPIC_API_KEY` and paste your API key

### 3. Run the App

```bash
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

### "Insufficient credits on Anthropic API account"
- Your API key doesn't have enough credits
- Go to [Anthropic Billing](https://console.anthropic.com/account/billing/overview)
- Add credits to your account

### "Invalid Anthropic API key"
- Your API key is incorrect or expired
- Generate a new one in the [Anthropic Console](https://console.anthropic.com/account/api-keys)
- Update the `ANTHROPIC_API_KEY` in your project settings

### No response from Claude
- Check your internet connection
- Make sure the API key is correctly set
- Check the browser console for error messages

## Tech Stack

- **Next.js 16** - React framework with API routes
- **TypeScript** - Type-safe code
- **Tailwind CSS** - Styling
- **Anthropic SDK** - Claude API integration
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
