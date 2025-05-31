# API Documentation

## Authentication
```javascript
const headers = {
  "Authorization": `Bearer ${API_KEY}`,
  "Content-Type": "application/json"
};
```

## Endpoints

### Generate Text
`POST /v1/generate`

**Parameters**:
- `prompt` (required)
- `max_tokens` (default: 100)
- `temperature` (default: 0.7)

## Rate Limits
- **Free tier**: 100 requests/hour
- **Pro tier**: 1,000 requests/hour
- **Enterprise**: Custom limits