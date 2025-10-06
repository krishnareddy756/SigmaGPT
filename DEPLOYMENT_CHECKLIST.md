# 🚀 SigmaGPT Deployment Checklist

## ✅ Pre-Deployment Checklist

### Backend (Render)
- [ ] Repository connected to Render
- [ ] Root directory set to `Backend`
- [ ] Build command: `npm install --legacy-peer-deps`
- [ ] Start command: `node server.js`
- [ ] All environment variables configured:
  - [ ] MONGODB_URI
  - [ ] OPENAI_API_KEY
  - [ ] TOGETHER_API_KEY
  - [ ] SERPAPI_API_KEY
  - [ ] PINECONE_API_KEY
  - [ ] PINECONE_ENVIRONMENT
  - [ ] NODE_ENV=production
  - [ ] NODE_VERSION=20.18.0

### Frontend (Vercel)
- [ ] Repository connected to Vercel
- [ ] Root directory set to `Frontend`
- [ ] Framework preset: Vite
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Environment variable: `VITE_API_URL` pointing to backend

## 🔄 Post-Deployment Steps

1. **Test Backend:**
   - Visit: `https://your-backend-url.onrender.com/api/health`
   - Should return: `{"status": "ok"}`

2. **Test Frontend:**
   - Visit your Vercel URL
   - Try sending a message in the chat
   - Check browser console for errors

3. **Update URLs if Different:**
   - If backend URL differs from `sigmagpt-backend.onrender.com`
   - Update `Frontend/vercel.json` VITE_API_URL
   - Update `Frontend/src/config/api.js`
   - Redeploy frontend

## 🐛 Common Issues & Solutions

### Backend Issues:
- **Build fails**: Check Node version (should be 20.18.0)
- **Environment variables**: Ensure all API keys are set
- **MongoDB connection**: Verify MONGODB_URI format

### Frontend Issues:
- **API calls fail**: Check VITE_API_URL points to correct backend
- **Build fails**: Ensure all dependencies install correctly
- **CORS errors**: Backend CORS should allow frontend domain

## 📝 Deployment URLs

**Backend (Render):** `https://[your-service-name].onrender.com`
**Frontend (Vercel):** `https://[your-project-name].vercel.app`

## 🔗 Useful Links

- [Render Dashboard](https://dashboard.render.com/)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [GitHub Repository](https://github.com/krishnareddy756/SigmaGPT)