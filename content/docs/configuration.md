---
title: Configuration
description: Learn how to configure the AI platform SDK with your credentials and customize settings
---

# Configuration Guide

After installing the SDK, you'll need to configure it with your API credentials and customize the settings to match your requirements.

## Basic Configuration

### Environment Variables

Set your API key as an environment variable:

```bash
export AI_API_KEY='your-api-key-here'
```

### In Your Application

Initialize the SDK with your configuration:

```javascript
import { AIClient } from '@ai-platform/sdk';

const client = new AIClient({
  apiKey: process.env.AI_API_KEY, // or directly provide the key
  environment: 'production', // 'sandbox' or 'production'
  timeout: 30000, // request timeout in milliseconds
  maxRetries: 3,  // number of retries for failed requests
});
```

## Advanced Configuration

### Custom HTTP Client

You can provide a custom HTTP client:

```javascript
import axios from 'axios';

const customClient = axios.create({
  baseURL: 'https://api.yourdomain.com/v1',
  headers: {
    'X-Custom-Header': 'value'
  }
});

const client = new AIClient({
  httpClient: customClient
});
```

### Error Handling

Handle errors effectively:

```javascript
try {
  const result = await client.predict({
    // your prediction parameters
  });
} catch (error) {
  if (error.code === 'AUTH_ERROR') {
    console.error('Authentication failed. Please check your API key.');
  } else if (error.code === 'RATE_LIMIT_EXCEEDED') {
    console.error('Rate limit exceeded. Please try again later.');
  } else {
    console.error('An error occurred:', error.message);
  }
}
```

## Best Practices

1. **Never commit API keys** to version control. Use environment variables or a secure secrets manager.
2. **Use different API keys** for development and production environments.
3. **Implement retry logic** for handling temporary failures.
4. **Monitor your usage** to stay within rate limits.

## Next Steps

- [Explore API endpoints](/docs/endpoints)
- [View code examples](/docs/examples)
- [Learn about authentication](/docs/auth)

Create `ai-platform.config.js` in your project root with basic settings: 

```js
export default {
  apiKey: 'YOUR_API_KEY',
  environment: 'production'
}
```
