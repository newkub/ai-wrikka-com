---
title: Authentication
description: Learn how to authenticate with the AI platform API using API keys and OAuth
---

# Authentication

Secure access to the AI platform is managed through API keys and OAuth 2.0. This guide explains how to authenticate your requests.

## API Keys

### Getting an API Key

1. Sign up for an account at [developer.example.com](https://developer.example.com)
2. Navigate to the API Keys section in your dashboard
3. Click "Create New API Key"
4. Copy the generated key (you won't be able to see it again!)

### Using API Keys

Include your API key in the `Authorization` header of your requests:

```http
GET /v1/models HTTP/1.1
Host: api.example.com
Authorization: Bearer YOUR_API_KEY
```

Or with the SDK:

```javascript
import { AIClient } from '@ai-platform/sdk';

const client = new AIClient({
  apiKey: 'your-api-key-here'
});
```

## OAuth 2.0

For applications that need to access user data, we recommend using OAuth 2.0.

### Authorization Code Flow

1. **Redirect users** to the authorization endpoint:
   ```
   GET https://auth.example.com/oauth/authorize?
     response_type=code&
     client_id=YOUR_CLIENT_ID&
     redirect_uri=YOUR_REDIRECT_URI&
     scope=read write
   ```

2. **Exchange the authorization code** for an access token:
   ```http
   POST /oauth/token
   Content-Type: application/x-www-form-urlencoded
   
   grant_type=authorization_code&
   code=AUTHORIZATION_CODE&
   redirect_uri=YOUR_REDIRECT_URI&
   client_id=YOUR_CLIENT_ID&
   client_secret=YOUR_CLIENT_SECRET
   ```

3. **Use the access token** in your API requests:
   ```http
   GET /v1/user/profile
   Authorization: Bearer ACCESS_TOKEN
   ```

## Security Best Practices

1. **Never expose API keys** in client-side code or public repositories
2. **Use environment variables** to store sensitive credentials
3. **Rotate API keys** regularly (at least every 90 days)
4. **Limit permissions** by using the principle of least privilege
5. **Monitor usage** for suspicious activity

## Rate Limiting

- **Free tier**: 100 requests/minute
- **Pro tier**: 1,000 requests/minute
- **Enterprise**: Custom limits available

## Troubleshooting

### Common Issues

- **401 Unauthorized**: Invalid or missing API key
- **403 Forbidden**: Insufficient permissions
- **429 Too Many Requests**: Rate limit exceeded

## Next Steps

- [View API Reference](/docs/endpoints)
- [Explore Examples](/docs/examples)
- [Contact Support](mailto:support@example.com)

Use API keys for authentication. Get your API key from the dashboard. Include it in requests:

```
Authorization: Bearer YOUR_API_KEY
```
