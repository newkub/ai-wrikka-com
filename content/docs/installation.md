---
title: Installation
description: Step-by-step guide to install and set up the AI platform SDK
---

# Installation Guide

Get started with our AI platform by installing the SDK in your project.

## Prerequisites

- Node.js 16.0 or later
- npm or yarn package manager
- An API key from the [developer portal](https://developer.example.com)

## Installation

### Using npm

```bash
npm install @ai-platform/sdk
```

### Using yarn

```bash
yarn add @ai-platform/sdk
```

## Verifying Installation

Create a test file `test.js`:

```javascript
import { AIClient } from '@ai-platform/sdk';

console.log('SDK version:', AIClient.version);
```

Run the test:
```bash
node test.js
```

You should see the SDK version printed in the console.

## Next Steps

- [Configure your API credentials](/docs/configuration)
- [Explore the API reference](/docs/endpoints)
- [Check out code examples](/docs/examples)

## Troubleshooting

If you encounter any issues during installation, please refer to our [troubleshooting guide](/docs/troubleshooting) or contact support.

Install with npm:
```bash
npm install @ai-platform/sdk
```
