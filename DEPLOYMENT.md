# Tourism Diary - Development & Deployment Guide

## 🖥️ Local Development Environment Setup

### Step 1: Clone/Download the Project
```bash
git clone <repository-url> tourism-diary
cd tourism-diary
```

### Step 2: Backend Setup

```bash
cd tourism-diary-backend
npm install
```

Create a `.env` file (optional):
```
PORT=5000
NODE_ENV=development
```

Start the backend:
```bash
# Production mode
npm start

# Development mode with auto-reload
npm run dev
```

Expected output:
```
Tourism Diary API running on http://localhost:5000
```

### Step 3: Frontend Setup (in another terminal)

```bash
cd tourism-diary-frontend
npm install
npm run dev
```

The application will automatically open at `http://localhost:3000`

## 🌐 API Testing

Test the backend API with cURL:

```bash
# Get all destinations
curl http://localhost:5000/api/destinations

# Get all entries
curl http://localhost:5000/api/entries

# Health check
curl http://localhost:5000/health

# Create new entry
curl -X POST http://localhost:5000/api/entries \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Amazing Trip",
    "content": "This was incredible...",
    "destinationId": "1",
    "date": "2024-09-20",
    "rating": 5
  }'
```

## 📦 Production Build

### Build Frontend

```bash
cd tourism-diary-frontend
npm run build
```

This creates an optimized build in the `dist/` folder.

### Production Backend

```bash
cd tourism-diary-backend
npm install --production
```

## ☁️ Deployment Options

### Option 1: Heroku (Recommended for Quick Deploy)

#### Backend Deployment

1. Create Heroku account and install Heroku CLI
2. In backend directory:
```bash
heroku login
heroku create tourism-diary-api
git push heroku main
```

3. Your backend will be at: `https://tourism-diary-api.herokuapp.com`

#### Frontend Deployment

1. Update API_BASE in `src/App.jsx`:
```javascript
const API_BASE = 'https://tourism-diary-api.herokuapp.com/api';
```

2. Deploy to Vercel:
```bash
npm i -g vercel
vercel
```

### Option 2: Railway.app

#### Backend
1. Create account at railway.app
2. Connect GitHub repository
3. Add service and link to repository backend folder
4. Railway generates URL automatically

#### Frontend
1. Create new service for frontend
2. Set build command: `npm run build`
3. Set start command: `npm run preview`

### Option 3: Render.com

#### Backend
1. Create account at render.com
2. New Web Service → GitHub
3. Select backend repository
4. Environment: Node
5. Build command: `npm install`
6. Start command: `npm start`
7. Add environment variable: PORT = 10000

#### Frontend
1. New Static Site → GitHub
2. Build command: `npm run build`
3. Publish directory: `dist`

### Option 4: Docker Containerization

Create `Dockerfile` for backend:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
```

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  backend:
    build: ./tourism-diary-backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
    volumes:
      - ./tourism-diary-backend/data:/app/data

  frontend:
    image: node:18-alpine
    working_dir: /app
    command: npm run dev
    ports:
      - "3000:3000"
    volumes:
      - ./tourism-diary-frontend:/app
```

Run with Docker:
```bash
docker-compose up
```

### Option 5: Traditional VPS (DigitalOcean, Linode, AWS EC2)

1. SSH into server
2. Install Node.js:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

3. Clone repository:
```bash
git clone <repo-url> /var/www/tourism-diary
cd /var/www/tourism-diary
```

4. Install PM2 for process management:
```bash
sudo npm install -g pm2
```

5. Start backend with PM2:
```bash
cd tourism-diary-backend
npm install
pm2 start server.js --name "tourism-api"
pm2 startup
pm2 save
```

6. Build and serve frontend:
```bash
cd ../tourism-diary-frontend
npm install
npm run build
sudo npm install -g serve
pm2 start "serve -s dist -p 3000" --name "tourism-app"
```

7. Set up Nginx reverse proxy:
```bash
sudo apt-get install nginx

# Edit /etc/nginx/sites-available/default
```

Example Nginx config:
```nginx
upstream api {
    server localhost:5000;
}

upstream frontend {
    server localhost:3000;
}

server {
    listen 80;
    server_name yourdomain.com;

    location /api {
        proxy_pass http://api;
    }

    location / {
        proxy_pass http://frontend;
    }
}
```

## 🔒 Security Considerations

### Environment Variables
Never commit sensitive data. Create `.env` file:
```
NODE_ENV=production
PORT=5000
API_KEY=your_secret_key
```

### CORS Configuration
For production, restrict CORS:
```javascript
app.use(cors({
  origin: 'https://yourdomain.com',
  credentials: true
}));
```

### Data Backup
Regularly backup `diary.json`:
```bash
# Automated backup
cp data/diary.json data/diary.backup.$(date +%Y%m%d).json
```

## 📊 Monitoring

### Using PM2 Monitor
```bash
pm2 monitor
pm2 web  # Web dashboard at localhost:9615
```

### Log Management
```bash
pm2 logs tourism-api
pm2 logs tourism-app
```

## 🚀 Continuous Integration/Deployment

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: |
          cd tourism-diary-backend
          npm install
          npm test
      - run: |
          cd ../tourism-diary-frontend
          npm install
          npm run build
      - uses: deployphp/action@master
        with:
          private-key: ${{ secrets.DEPLOY_KEY }}
          known-hosts: ${{ secrets.KNOWN_HOSTS }}
```

## 📈 Performance Optimization

### Frontend
- Enable gzip compression
- Lazy load images
- Minify CSS/JS (Vite does this by default)
- Use CDN for static assets

### Backend
- Add caching headers:
```javascript
app.use((req, res, next) => {
  res.header('Cache-Control', 'public, max-age=300');
  next();
});
```

- Implement request throttling
- Add logging with Winston or Morgan

## 🔄 Database Migration

To migrate from JSON to MongoDB:

```javascript
// migration.js
const mongoose = require('mongoose');
const fs = require('fs');

const entrySchema = new mongoose.Schema({
  title: String,
  content: String,
  destinationId: String,
  date: Date,
  rating: Number,
  photos: [String],
  createdAt: Date
});

const Entry = mongoose.model('Entry', entrySchema);

const data = JSON.parse(fs.readFileSync('data/diary.json'));
Entry.insertMany(data.entries);
```

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS errors | Check backend CORS config and URL match |
| 404 Not Found | Verify API endpoint paths and data exists |
| Port already in use | Change PORT in config or kill process: `lsof -i :5000` |
| Data not saving | Check file permissions on data/ directory |
| Slow performance | Check JSON file size, consider database migration |

## 📞 Support Resources

- Express.js Docs: https://expressjs.com
- React Docs: https://react.dev
- Vite Docs: https://vitejs.dev
- Node.js Docs: https://nodejs.org/docs

---

**Your tourism diary is ready for the world! 🌍**
