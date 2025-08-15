# SEO Audit UI - React Frontend

A modern React-based frontend for the SEO Audit System, designed to work with Azure Functions backend and integrate with Azure Static Web Apps.

## Features

- 🔍 **SEO Audit Interface** - User-friendly form to submit URLs for analysis
- 📊 **Results Dashboard** - Comprehensive display of audit results with scores and recommendations
- 👤 **User Dashboard** - Track audit history and manage account
- 💰 **Pricing Page** - Subscription tiers and feature comparison
- 🛠️ **Admin Dashboard** - System monitoring and user management
- 📱 **Responsive Design** - Mobile-first design with Tailwind CSS
- ⚡ **Fast Performance** - Built with Vite for optimal development and build experience

## Tech Stack

- **React 18** - Modern React with hooks and functional components
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Heroicons** - Beautiful SVG icons
- **Axios** - HTTP client for API calls
- **React Helmet Async** - SEO meta tags management
- **Vite** - Fast build tool and development server

## Project Structure

```
seo-audit-ui/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── SEOAuditPage.jsx
│   │   ├── ResultsPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── PricingPage.jsx
│   │   ├── AdminPage.jsx
│   │   └── NotFoundPage.jsx
│   ├── utils/
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Azure Function App (for backend API)
- Azure Static Web Apps (for deployment)

### Installation

1. **Clone and navigate to the project:**
   ```bash
   cd seo-audit-ui
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_API_BASE_URL=https://your-function-app.azurewebsites.net
   REACT_APP_ENVIRONMENT=development
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

### Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## API Integration

The frontend integrates with Azure Functions through the API utility (`src/utils/api.js`):

### SEO Audit API
- `POST /api/seo_audit` - Run SEO audit
- `GET /api/seo_audit/{id}` - Get audit results
- `GET /api/audits/history` - Get user's audit history
- `GET /api/audits/{id}/report` - Download PDF report

### Configuration

Update the API base URL in `src/utils/api.js` or use environment variables:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://your-function-app.azurewebsites.net'
```

## Deployment

### Azure Static Web Apps

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy using Azure CLI:**
   ```bash
   # Login to Azure
   az login
   
   # Create resource group (if needed)
   az group create --name rg-seo-audit --location eastus
   
   # Create static web app
   az staticwebapp create \
     --name seo-audit-ui \
     --resource-group rg-seo-audit \
     --source https://github.com/yourusername/seo-audit-ui \
     --location eastus \
     --branch main \
     --app-location "/" \
     --output-location "dist"
   ```

3. **Configure GitHub Actions:**
   Azure Static Web Apps automatically creates a GitHub Actions workflow for CI/CD.

### Manual Deployment

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Upload the `dist` folder to your hosting provider**

## Environment Configuration

### Development
```env
REACT_APP_API_BASE_URL=http://localhost:7071
REACT_APP_ENVIRONMENT=development
```

### Production
```env
REACT_APP_API_BASE_URL=https://your-function-app.azurewebsites.net
REACT_APP_ENVIRONMENT=production
```

## Features Overview

### Homepage
- Hero section with call-to-action
- Feature highlights
- Statistics and social proof
- Navigation to audit and pricing

### SEO Audit Page
- URL input with validation
- Tier selection (Free, Basic, Premium)
- Real-time audit processing
- Progress indicators

### Results Page
- Overall SEO score
- Detailed analysis sections
- Critical issues and recommendations
- Download PDF report option

### Dashboard
- Audit history with filtering
- Performance tracking
- Account management
- Usage statistics

### Pricing Page
- Subscription tiers comparison
- Feature matrix
- FAQ section
- Payment integration ready

### Admin Dashboard
- System overview and statistics
- User management
- Audit monitoring
- System logs

## Customization

### Styling
The project uses Tailwind CSS with custom configuration in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: { /* custom primary colors */ },
      success: { /* custom success colors */ },
      // ... more custom colors
    }
  }
}
```

### Components
All components are functional React components using hooks. Key patterns:

- State management with `useState` and `useEffect`
- API calls with async/await
- Error handling with try/catch
- Loading states and user feedback

## Integration with Azure Services

### Azure Functions
- RESTful API endpoints
- CORS configuration for frontend domain
- Authentication and authorization

### Azure Static Web Apps
- Automatic HTTPS
- Global CDN
- Custom domains
- GitHub Actions CI/CD

### Azure Application Insights
- Performance monitoring
- Error tracking
- User analytics

## Security Considerations

- Environment variables for sensitive configuration
- HTTPS enforcement
- Input validation and sanitization
- CORS configuration
- Authentication token management

## Performance Optimization

- Code splitting with React.lazy
- Image optimization
- Bundle size monitoring
- Caching strategies
- CDN integration

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Email: support@seoaudit.com
- Documentation: [Azure Static Web Apps Docs](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- Issues: GitHub Issues

## Roadmap

- [ ] Progressive Web App (PWA) features
- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Accessibility improvements