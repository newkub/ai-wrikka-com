---
title: Examples
---

```javascript
import AIPlatform from '@ai-platform/sdk';

const client = new AIPlatform({
  apiKey: 'YOUR_API_KEY'
});

// Make prediction
const result = await client.predict({
  model: 'text-generator',
  input: 'Hello world'
});
```
