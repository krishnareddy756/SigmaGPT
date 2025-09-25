# Render Deployment Guide for SigmaGPT

## Issue Fixed
- **Problem**: Dependency conflict between `dotenv@17.2.0` and `@langchain/community` which requires `dotenv@^16.4.5`
- **Solution**: Downgraded dotenv to version 16.4.5 and added npm overrides

## Changes Made

### 1. Updated package.json
- Downgraded `dotenv` from `^17.2.0` to `^16.4.5`
- Added `overrides` section to force dotenv version consistency
- Enhanced build scripts with fallback options

### 2. Added .npmrc
- Set `legacy-peer-deps=true` to handle peer dependency conflicts
- Disabled audit and fund messages for cleaner builds

### 3. Build Configuration
- Build command: `npm install --legacy-peer-deps`
- Start command: `node server.js`

## Render Deployment Settings

### Environment Variables (Add these in Render Dashboard)
Make sure to set these environment variables in your Render service:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
TOGETHER_API_KEY=your_together_api_key
SERPAPI_API_KEY=your_serpapi_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=your_pinecone_environment
```

### Service Configuration
- **Build Command**: `npm install --legacy-peer-deps`
- **Start Command**: `node server.js`
- **Node Version**: 22.16.0 (or latest LTS)
- **Root Directory**: `Backend` (if deploying only backend)

## Testing Locally
1. Navigate to Backend directory
2. Run `npm install`
3. Create `.env` file with required environment variables
4. Run `npm start` or `npm run dev`

## Troubleshooting

### If you still get dependency errors:
1. Try `npm install --force`
2. Delete `node_modules` and `package-lock.json`, then run `npm install`
3. Use `npm install --legacy-peer-deps` explicitly

### For Render deployment issues:
1. Check the build logs for specific errors
2. Ensure all environment variables are set
3. Verify the start command is correct
4. Check that the port is set to process.env.PORT || 10000