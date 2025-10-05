# MongoDB Atlas Setup for Render Deployment

## Steps to Fix MongoDB Connection:

### 1. Check Environment Variables in Render
1. Go to your Render dashboard
2. Navigate to your backend service
3. Go to "Environment" tab
4. Verify `MONGODB_URL` is set correctly

### 2. Update IP Whitelist in MongoDB Atlas
1. Login to MongoDB Atlas
2. Go to Network Access
3. Add Render's IP ranges:
   ```
   0.0.0.0/0  (Allow all - for simplicity)
   ```
   Or add specific Render IPs if needed

### 3. Get Fresh Connection String
1. In MongoDB Atlas, go to "Connect"
2. Choose "Connect your application"
3. Copy the connection string
4. Format: `mongodb+srv://<username>:<password>@cluster0.xrxte.mongodb.net/<database>?retryWrites=true&w=majority`

### 4. Update Environment Variable
1. In Render dashboard
2. Environment tab
3. Update `MONGODB_URL` with fresh connection string
4. Redeploy service

## Alternative: Use MongoDB Atlas Shared Cluster
If current cluster has issues, create a new free cluster:
1. Create new cluster in MongoDB Atlas
2. Set up database user
3. Whitelist IPs (0.0.0.0/0)
4. Get new connection string
5. Update Render environment variable