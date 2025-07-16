# Telegram Bot - Netlify Migration

This project contains a Telegram bot backend that has been migrated from AWS Lambda to Netlify Functions. The bot provides a reward system with referrals, daily check-ins, and random rewards.

## Features

- **Referral System**: Users can refer friends and earn tiered rewards
- **Daily Check-ins**: Daily rewards with streak bonuses
- **Random Rewards**: Periodic random point rewards with jackpot chances
- **User Statistics**: Comprehensive stats with tier progression
- **Firebase Integration**: Real-time database for user data and analytics

## Migration Changes

### Key Differences from AWS Lambda

1. **Function Signature**: Changed from `exports.handler = async (event)` to `export default async function handler(request, context)`
2. **Request Handling**: Uses Web API `Request` object instead of Lambda event object
3. **Response Format**: Returns `Response` objects instead of Lambda response format
4. **Environment**: Netlify Functions runtime instead of AWS Lambda runtime
5. **Configuration**: Uses `netlify.toml` instead of AWS Lambda configuration

### Code Adaptations

- **Request Parsing**: Changed from `JSON.parse(event.body)` to `await request.json()`
- **Response Format**: Changed from `{ statusCode: 200, body: "message" }` to `new Response("message", { status: 200 })`
- **Error Handling**: Adapted to return proper Response objects with JSON content-type headers
- **State Management**: Replaced global state with Netlify context storage (where available)

## Project Structure

```
telegram-bot-netlify/
├── netlify/
│   └── functions/
│       └── telegram-webhook.js    # Main bot function
├── netlify.toml                   # Netlify configuration
├── package.json                   # Dependencies and scripts
├── .env.example                   # Environment variables template
├── .gitignore                     # Git ignore rules
└── README.md                      # This file
```

## Setup Instructions

### 1. Prerequisites

- Node.js (v18 or later)
- Netlify account
- Telegram Bot Token (from @BotFather)
- Firebase Realtime Database

### 2. Local Development Setup

1. **Clone/Download the project**
   ```bash
   cd telegram-bot-netlify
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and add your BOT_TOKEN
   ```

4. **Start local development server**
   ```bash
   npm run dev
   ```

   This will start Netlify Dev server, typically on `http://localhost:8888`

### 3. Deployment to Netlify

#### Option A: Netlify CLI (Recommended)

1. **Install Netlify CLI globally**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize the site**
   ```bash
   netlify init
   ```

4. **Set environment variables**
   ```bash
   netlify env:set BOT_TOKEN "your_actual_bot_token_here"
   ```

5. **Deploy**
   ```bash
   netlify deploy --prod
   ```

#### Option B: Git Integration

1. **Push to GitHub/GitLab**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Connect to Netlify**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "New site from Git"
   - Connect your repository
   - Set build settings:
     - Build command: `npm run build`
     - Publish directory: (leave empty)

3. **Set environment variables in Netlify Dashboard**
   - Go to Site settings > Environment variables
   - Add `BOT_TOKEN` with your actual token

### 4. Configure Telegram Webhook

After deployment, you'll get a Netlify URL like `https://your-site-name.netlify.app`

Set your Telegram webhook to point to your function:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
     -H "Content-Type: application/json" \
     -d '{"url": "https://your-site-name.netlify.app/.netlify/functions/telegram-webhook"}'
```

Or use the redirect URL (configured in netlify.toml):
```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
     -H "Content-Type: application/json" \
     -d '{"url": "https://your-site-name.netlify.app/webhook"}'
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `BOT_TOKEN` | Telegram Bot Token from @BotFather | Yes |
| `FIREBASE_DB_URL` | Firebase Realtime Database URL | No (defaults to hardcoded URL) |

## Function Endpoints

- **Main webhook**: `/.netlify/functions/telegram-webhook`
- **Redirect URL**: `/webhook` (redirects to main function)

## Bot Commands

- `/start [referral_code]` - Start the bot (with optional referral)
- `/refer` - Get your referral link
- `/stats` - View your statistics and tier information
- `/daily` - Daily check-in for rewards
- `/reward` - Claim random rewards (with cooldown)

## Reward System

### Referral Tiers
- **Bronze** (0-4 referrals): 25,000 points per referral
- **Silver** (5-14 referrals): 30,000 points per referral
- **Gold** (15-29 referrals): 40,000 points per referral
- **Diamond** (30+ referrals): 50,000 points per referral

### Daily Rewards
- Base reward: 1,000 points
- 3-day streak bonus: +2,000 points
- 7-day streak bonus: +5,000 points
- Streak protection for 7+ day streaks

### Random Rewards
- Range: 500-5,000 points
- 10% jackpot chance (5x multiplier)
- 4-hour cooldown between claims

## Monitoring and Logs

- **Netlify Functions Logs**: Available in Netlify Dashboard > Functions tab
- **Real-time Monitoring**: Check function invocations and errors
- **Firebase Logs**: Bot activities are logged to Firebase under `/logs/`

## Troubleshooting

### Common Issues

1. **Function timeout**: Increase timeout in `netlify.toml` if needed
2. **Environment variables not working**: Ensure they're set in Netlify Dashboard
3. **Webhook not receiving updates**: Verify webhook URL is correctly set with Telegram
4. **Firebase connection issues**: Check Firebase URL and permissions

### Testing Webhook Locally

Use ngrok to expose your local development server:

```bash
# Install ngrok
npm install -g ngrok

# Expose local server
ngrok http 8888

# Set webhook to ngrok URL
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
     -H "Content-Type: application/json" \
     -d '{"url": "https://your-ngrok-url.ngrok.io/.netlify/functions/telegram-webhook"}'
```

## Performance Considerations

- **Cold starts**: Netlify Functions may have cold start delays
- **Concurrent requests**: Netlify handles concurrent function invocations automatically
- **Memory usage**: Monitor function memory usage in Netlify Dashboard
- **Execution time**: Functions have a 10-second timeout limit

## Security Notes

- Environment variables are securely stored in Netlify
- Firebase security rules should be properly configured
- Bot token should never be exposed in client-side code
- Consider implementing rate limiting for production use

## Migration Benefits

1. **Simplified deployment**: No need for AWS account or Lambda configuration
2. **Integrated CI/CD**: Automatic deployments from Git
3. **Built-in monitoring**: Function logs and metrics in Netlify Dashboard
4. **Cost-effective**: Generous free tier for small to medium usage
5. **Easy scaling**: Automatic scaling based on demand

## Support

For issues related to:
- **Netlify Functions**: Check [Netlify Documentation](https://docs.netlify.com/functions/)
- **Telegram Bot API**: Check [Telegram Bot API Documentation](https://core.telegram.org/bots/api)
- **Firebase**: Check [Firebase Documentation](https://firebase.google.com/docs)

## License

MIT License - feel free to modify and use for your own projects.

