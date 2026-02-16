# EcommerceGroup Project

Full-stack e-commerce application with React frontend and Spring Boot backend.

## 🏗️ Project Structure

```
EcommerceGroup/
├── frontend/          # React + Vite + TypeScript
├── backend/           # Spring Boot + MongoDB
├── DEPLOYMENT_GUIDE.md   # Detailed deployment instructions
└── QUICK_DEPLOY.md       # Quick deployment guide
```

## 🚀 Quick Start

### Local Development

**Frontend:**
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

**Backend:**
```bash
cd backend
./mvnw spring-boot:run
# Runs on http://localhost:8080
```

### Production Deployment

See [`QUICK_DEPLOY.md`](./QUICK_DEPLOY.md) for fastest deployment steps.

See [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md) for comprehensive deployment guide.

## 📦 Tech Stack

### Frontend
- ⚛️ React 19
- ⚡ Vite 7
- 📘 TypeScript
- 🎨 Vanilla CSS
- 🔄 React Router
- 📊 Recharts
- 🌐 i18next (Internationalization)
- 🔐 React OAuth (Google)

### Backend
- ☕ Java 17
- 🍃 Spring Boot 4.0.1
- 📦 MongoDB
- 🔒 Spring Security + JWT
- 📧 Spring Mail
- 💳 PayHere Integration
- 🤖 Google Gemini AI Integration

## 📋 Prerequisites

- Node.js 18+
- Java 17+
- Maven 3.8+
- MongoDB instance (or MongoDB Atlas)

## 🌐 Deployment Platforms

| Component | Recommended Platform | Alternative |
|-----------|---------------------|-------------|
| Frontend  | Vercel              | Netlify     |
| Backend   | Railway             | Render      |

## 📚 Documentation

- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Complete deployment walkthrough
- [Quick Deploy](./QUICK_DEPLOY.md) - Fast deployment steps
- [Viva Presentation Guide](./VIVA_PRESENTATION_GUIDE.md) - Presentation guide

## 🔐 Environment Variables

### Frontend
Create `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:8080
```

### Backend
Configure in `backend/src/main/resources/application.properties` or use environment variables (see `backend/.env.example`)

## 🛠️ Development Commands

### Frontend
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend
```bash
./mvnw spring-boot:run        # Run application
./mvnw clean install          # Build application
./mvnw test                   # Run tests
```

## ⚠️ Important Security Notes

1. **Never commit sensitive data** - Use environment variables
2. **Update `application.properties`** - Current file contains exposed secrets
3. **Use different credentials** for production and development
4. **Enable CORS properly** in production

## 📞 Support

For deployment issues, see the troubleshooting section in [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md)

## 📄 License

This project is for educational purposes.

---

**Made with ❤️ for your viva presentation**
