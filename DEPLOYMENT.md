# Azure Static Web Apps Deployment Guide

## 🚀 Deployment Status

**✅ Application is READY for Azure deployment!**

- ✅ Build process working (`npm run build` successful)
- ✅ Azure resources exist and accessible
- ✅ Configuration files created
- ✅ Deployment scripts prepared
- ✅ GitHub Actions workflow configured

## 📋 Azure Resources

| Resource | Name | Status | URL |
|----------|------|--------|-----|
| Static Web App | `seoaudit-webapp` | ✅ Active | <https://witty-desert-0ac8c7a0f.2.azurestaticapps.net> |
| Function App | `seoaudit-functions` | ✅ Active | https://seoaudit-functions.azurewebsites.net |
| Resource Group | `SEOAudit-RG` | ✅ Active | - |

## 🔧 Configuration Files



### Created Files:
- ✅ `staticwebapp.config.json` - Azure SWA routing configuration
- ✅ `.env.example` - Environment variables template
- ✅ `.github/workflows/azure-static-web-apps.yml` - GitHub Actions workflow
- ✅ `deploy.ps1` - Manual deployment script
- ✅ `DEPLOYMENT.md` - This deployment guide

### Updated Files:
- ✅ `src/utils/api.js` - Updated with correct Azure Function App URL

## 🚀 Deployment Options

### Option 1: GitHub Actions (Recommended)

1. **Push to GitHub repository**
2. **Add Azure Static Web Apps API token as GitHub secret:**
   ```
   Secret Name: AZURE_STATIC_WEB_APPS_API_TOKEN
   Secret Value: [GENERATE IN AZURE PORTAL → Static Web App → Deployment tokens → Copy token]
   ```
   Note: Do not commit tokens to source control. Rotate any previously exposed token in Azure.
3. **GitHub Actions will automatically:**
   - Install dependencies
   - Build the application
   - Deploy to Azure Static Web Apps

### Option 2: Manual Deployment via Azure Portal

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Create deployment package:**
   ```powershell
   .\deploy.ps1
   ```

3. **Upload via Azure Portal:**
   - Go to Azure Portal → Static Web Apps → seoaudit-webapp
   - Navigate to "Deployment" section
   - Upload the generated zip file

### Option 3: Azure CLI (Alternative)

```bash
# Build the application
npm run build

# Deploy using Azure CLI (requires Azure Static Web Apps CLI)
npx @azure/static-web-apps-cli deploy --app-location ./dist --api-token "YOUR_API_TOKEN"
```

## 🔐 Environment Variables

### Production Environment Variables:
```env
VITE_API_BASE_URL=https://seoaudit-functions.azurewebsites.net
VITE_ENVIRONMENT=production
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_REPORTING=true
VITE_API_TIMEOUT=30000
VITE_DEBUG=false
```

## 📊 Build Information

- **Build Tool:** Vite
- **Output Directory:** `dist/`
- **Build Size:** ~0.19 MB (compressed)
- **Assets:**
  - `index.html` (0.82 kB)
  - `assets/index-da44b4d1.css` (27.06 kB)
  - `assets/index-3e93d73c.js` (231.24 kB)

## 🔗 API Integration

- **Azure Function App:** `seoaudit-functions.azurewebsites.net`
- **API Endpoints:** Configured in `src/utils/api.js`
- **Authentication:** Ready for Azure AD integration
- **CORS:** Configured for Static Web App domain

## 🧪 Testing Deployment

After deployment, verify:

1. **Application loads:** https://witty-desert-0ac8c7a0f.2.azurestaticapps.net
2. **Routing works:** Navigate between pages
3. **API connectivity:** Check dashboard data loading
4. **RevenueCat integration:** Test subscription features
5. **Responsive design:** Test on mobile devices

## 🚨 Troubleshooting

### Common Issues:

1. **Build Failures:**
   - Check Node.js version (requires 16+)
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`

2. **API Connection Issues:**
   - Verify Azure Function App is running
   - Check CORS settings in Function App
   - Validate API endpoints in `src/utils/api.js`

3. **Routing Issues:**
   - Ensure `staticwebapp.config.json` is properly configured
   - Check fallback routes for SPA

## 📈 Next Steps

1. **Deploy Python Azure Functions** (from TASKS.md)
2. **Configure custom domain** (optional)
3. **Set up Application Insights** for monitoring
4. **Configure RevenueCat webhooks**
5. **Set up CI/CD pipeline** for automated deployments

## 🎯 Deployment Confirmation

**Ready to deploy?** ✅

- All prerequisites met
- Configuration files in place
- Build process verified
- Azure resources accessible
- Deployment scripts prepared

**Estimated deployment time:** 2-5 minutes
**Post-deployment URL:** https://witty-desert-0ac8c7a0f.2.azurestaticapps.net