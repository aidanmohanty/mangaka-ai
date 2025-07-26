# 🚀 VERCEL MANUAL DEPLOYMENT GUIDE

## 📋 **STEP-BY-STEP DEPLOYMENT**

### **1. GitHub Setup (5 minutes)**
```bash
# Run this after creating GitHub repo
cd manga-ai-translator
github-setup.bat
```

### **2. Vercel Deployment (5 minutes)**

#### **A. Import Repository**
1. Go to: https://vercel.com/dashboard
2. Click **"Import Git Repository"**
3. Select your `mangaka-ai` repository
4. Click **"Import"**

#### **B. Configure Build Settings**
- **Framework Preset**: Other
- **Build Command**: `cd client && npm run build`
- **Output Directory**: `client/build`
- **Install Command**: `npm install`

#### **C. Add Environment Variables**
Click **"Environment Variables"** and add these:

```bash
# Required Variables
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mangaka-ai
OPENAI_API_KEY=sk-your-openai-key
STRIPE_SECRET_KEY=sk_live_your-stripe-key
SENDGRID_API_KEY=SG.your-sendgrid-key
JWT_SECRET=your-super-secure-jwt-secret-256-bits

# Optional but Recommended
NODE_ENV=production
CORS_ORIGIN=https://your-vercel-domain.vercel.app
STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-publishable-key
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

### **3. Deploy!**
1. Click **"Deploy"**
2. Wait 2-3 minutes for build
3. Get your live URL!

## 🗄️ **MONGODB ATLAS QUICK SETUP**

### **Connection String Format:**
```
mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/mangaka-ai?retryWrites=true&w=majority
```

### **Steps:**
1. **Create Cluster**: https://cloud.mongodb.com
2. **Database Access**: Create user with read/write permissions
3. **Network Access**: Add IP `0.0.0.0/0` (allow all)
4. **Connect**: Copy connection string
5. **Replace**: `<username>`, `<password>`, `<cluster>`

## 🔑 **API KEYS NEEDED**

### **OpenAI** (Required for AI translation)
- Go to: https://platform.openai.com/api-keys
- Create new key
- Format: `sk-proj-xxxxxxxxxxxxx`

### **Stripe** (Required for payments)
- Go to: https://dashboard.stripe.com/apikeys
- Get both: Publishable key (`pk_live_`) and Secret key (`sk_live_`)

### **SendGrid** (Required for emails)
- Go to: https://app.sendgrid.com/settings/api_keys
- Create API key
- Format: `SG.xxxxxxxxxxxxx`

## ⚡ **QUICK ENVIRONMENT VARIABLES**

Copy-paste this template and fill in your values:

```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/mangaka-ai?retryWrites=true&w=majority
OPENAI_API_KEY=sk-proj-YOUR_OPENAI_KEY
STRIPE_SECRET_KEY=sk_live_YOUR_STRIPE_SECRET
STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_STRIPE_PUBLISHABLE
SENDGRID_API_KEY=SG.YOUR_SENDGRID_KEY
JWT_SECRET=mangaka-ai-super-secure-jwt-secret-production-2024
NODE_ENV=production
CORS_ORIGIN=https://your-project-name.vercel.app
```

## 🎯 **POST-DEPLOYMENT CHECKLIST**

- [ ] Website loads at Vercel URL
- [ ] Landing page displays correctly
- [ ] User registration works
- [ ] Login functionality works
- [ ] Database connection established
- [ ] Payment processing ready
- [ ] Email notifications working

## 🚨 **COMMON ISSUES & FIXES**

### **Build Fails:**
- Check if `client/build` directory exists
- Verify Node.js version (18+)
- Check for missing dependencies

### **Database Connection Error:**
- Verify MongoDB connection string
- Check IP whitelist (0.0.0.0/0)
- Ensure database user has correct permissions

### **API Errors:**
- Verify all environment variables are set
- Check API key formats
- Test API keys individually

## 🎉 **SUCCESS METRICS**

Once deployed, you should see:
- ✅ Landing page loads
- ✅ Registration/login works  
- ✅ Database queries succeed
- ✅ No console errors
- ✅ Mobile responsive design

## 🔥 **READY TO LAUNCH?**

Your manga translation empire is one deployment away! 🎌

---

**Need help?** Check the build logs in Vercel dashboard for specific error messages.