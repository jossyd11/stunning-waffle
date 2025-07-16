# Deployment Guide: AWS Lambda to Netlify Migration

This guide provides step-by-step instructions for migrating your Telegram bot from AWS Lambda to Netlify Functions.

## Pre-Migration Checklist

- [ ] Backup your current AWS Lambda function code
- [ ] Note down your current environment variables
- [ ] Document your current webhook URL
- [ ] Ensure you have admin access to your Telegram bot
- [ ] Have your Firebase database credentials ready

## Migration Steps

### Step 1: Prepare the Netlify Project

1. **Download the migrated code** (this project)
2. **Review the changes** in the main function file
3. **Update any custom configurations** specific to your bot

### Step 2: Set Up Local Development

```bash
# Navigate to project directory
cd telegram-bot-netlify

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env file with your bot token
nano .env  # or use your preferred editor
```

Add your bot token to the `.env` file:
```
BOT_TOKEN=your_actual_telegram_bot_token
```

### Step 3: Test Locally

```bash
# Start local development server
npm run dev
```

The function will be available at: `http://localhost:8888/.netlify/functions/telegram-webhook`

### Step 4: Deploy to Netlify

#### Option A: Using Netlify CLI (Recommended)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize the site
netlify init

# Set environment variables
netlify env:set BOT_TOKEN "your_actual_bot_token"

# Deploy to production
netlify deploy --prod
```

#### Option B: Using Git Integration

1. **Create a new repository** on GitHub/GitLab
2. **Push your code**:
   ```bash
   git init
   git add .
   git commit -m "Migrate Telegram bot to Netlify"
   git remote add origin your-repo-url
   git push -u origin main
   ```
3. **Connect to Netlify**:
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "New site from Git"
   - Select your repository
   - Configure build settings (use defaults)
   - Deploy

4. **Set environment variables** in Netlify Dashboard:
   - Go to Site settings > Environment variables
   - Add `BOT_TOKEN` with your bot token value

### Step 5: Update Telegram Webhook

After successful deployment, you'll receive a Netlify URL like: `https://amazing-site-name.netlify.app`

**Update your Telegram webhook**:

```bash
# Replace YOUR_BOT_TOKEN and YOUR_NETLIFY_URL
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
     -H "Content-Type: application/json" \
     -d '{"url": "https://YOUR_NETLIFY_URL/.netlify/functions/telegram-webhook"}'
```

**Alternative using the redirect URL**:
```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
     -H "Content-Type: application/json" \
     -d '{"url": "https://YOUR_NETLIFY_URL/webhook"}'
```

### Step 6: Verify Migration

1. **Test basic commands** in your Telegram bot:
   - Send `/start` to your bot
   - Try `/refer`, `/stats`, `/daily`, `/reward`

2. **Check Netlify Function logs**:
   - Go to Netlify Dashboard > Functions
   - Click on `telegram-webhook`
   - Monitor real-time logs

3. **Verify database operations**:
   - Check if new users are being created in Firebase
   - Verify points are being awarded correctly

### Step 7: Clean Up AWS Lambda (Optional)

Once you've verified everything works correctly:

1. **Download a final backup** of your Lambda function
2. **Update any documentation** with new webhook URLs
3. **Consider keeping Lambda function** for a few days as backup
4. **Delete AWS Lambda function** when confident in migration

## Post-Migration Monitoring

### Week 1: Intensive Monitoring
- Check function logs daily
- Monitor error rates
- Verify all bot features work correctly
- Watch for any performance issues

### Week 2-4: Regular Monitoring
- Weekly log reviews
- Monitor function execution times
- Check for any user-reported issues
- Optimize if needed

## Rollback Plan

If issues arise, you can quickly rollback:

1. **Revert webhook to AWS Lambda**:
   ```bash
   curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
        -H "Content-Type: application/json" \
        -d '{"url": "https://your-aws-lambda-url"}'
   ```

2. **Restore AWS Lambda function** if deleted
3. **Investigate issues** with Netlify deployment
4. **Re-attempt migration** after fixes

## Performance Optimization

### Reduce Cold Starts
- Consider using Netlify's background functions for periodic tasks
- Implement function warming if needed
- Optimize function bundle size

### Monitor Resource Usage
- Check function execution time in Netlify Dashboard
- Monitor memory usage
- Optimize database queries if needed

### Scaling Considerations
- Netlify automatically scales functions
- Monitor concurrent execution limits
- Consider upgrading Netlify plan if needed

## Troubleshooting Common Issues

### Issue: Function Timeout
**Solution**: Increase timeout in `netlify.toml`:
```toml
[functions."telegram-webhook"]
  timeout = 30
```

### Issue: Environment Variables Not Working
**Solutions**:
1. Verify variables are set in Netlify Dashboard
2. Redeploy after setting variables
3. Check variable names match exactly

### Issue: Webhook Not Receiving Updates
**Solutions**:
1. Verify webhook URL is correct
2. Check if function is deployed successfully
3. Test function endpoint directly
4. Verify Telegram webhook is set correctly

### Issue: Database Connection Problems
**Solutions**:
1. Check Firebase URL is correct
2. Verify Firebase permissions
3. Test database connection locally
4. Check for network/firewall issues

## Cost Comparison

### AWS Lambda Costs
- Pay per request and execution time
- Additional costs for API Gateway
- CloudWatch logs charges

### Netlify Functions Costs
- Generous free tier (125,000 requests/month)
- Simple pricing structure
- Included monitoring and logs

## Security Considerations

### Environment Variables
- Stored securely in Netlify
- Not exposed in function logs
- Encrypted at rest

### Function Security
- HTTPS by default
- No need for API Gateway configuration
- Built-in DDoS protection

### Database Security
- Maintain existing Firebase security rules
- Consider implementing rate limiting
- Monitor for unusual activity

## Support Resources

- **Netlify Documentation**: https://docs.netlify.com/functions/
- **Netlify Community**: https://community.netlify.com/
- **Telegram Bot API**: https://core.telegram.org/bots/api
- **Firebase Documentation**: https://firebase.google.com/docs

## Migration Checklist

- [ ] Code migrated and tested locally
- [ ] Deployed to Netlify successfully
- [ ] Environment variables configured
- [ ] Webhook updated in Telegram
- [ ] All bot commands tested
- [ ] Function logs monitored
- [ ] Performance verified
- [ ] Documentation updated
- [ ] Team notified of new URLs
- [ ] AWS Lambda backup created
- [ ] Migration completed successfully

## Next Steps

After successful migration:

1. **Monitor performance** for the first few weeks
2. **Optimize function** based on usage patterns
3. **Consider additional features** enabled by Netlify
4. **Update monitoring and alerting** systems
5. **Document lessons learned** for future migrations

Congratulations on successfully migrating your Telegram bot to Netlify! 🎉

