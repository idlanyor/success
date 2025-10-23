# Deployment Guide

Panduan deploy Success Card API ke berbagai platform.

## 📋 Pre-Deployment Checklist

- [ ] Test semua endpoints locally
- [ ] Pastikan Puppeteer berjalan dengan baik
- [ ] Set environment variables
- [ ] Configure CORS jika diperlukan
- [ ] Test dengan real imageurl (CORS-enabled)
- [ ] Set production NODE_ENV
- [ ] Configure cache headers
- [ ] Setup monitoring/logging

## 🚀 Platform-Specific Guides

### 1. Heroku

#### Requirements
- Build tools untuk Canvas (included in Heroku stack)

#### Steps

```bash
# Login
heroku login

# Create app
heroku create your-app-name

# Set environment
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# Scale
heroku ps:scale web=1
```

#### Procfile
```
web: node index.js
```

#### Important Notes
- Free tier (512MB) is sufficient for Canvas
- Canvas is lighter than Puppeteer
- No special buildpacks needed

---

### 2. Railway

#### Steps

1. Push code ke GitHub
2. Go to [railway.app](https://railway.app)
3. **New Project** → **Deploy from GitHub**
4. Select repository
5. Railway auto-detects Node.js
6. Add environment variables:
   ```
   NODE_ENV=production
   ```
7. Deploy!

#### Advantages
- Auto-installs Canvas dependencies
- No special configuration needed
- Good performance
- Easy scaling
- Affordable pricing

---

### 3. Vercel

✅ **Canvas works well on Vercel!**

Canvas rendering is fast (~100-300ms), well within Vercel limits:
- Max execution time: 10s (Hobby), 60s (Pro)
- Max payload size: 4.5MB (images typically < 500KB)

#### Deployment Steps

1. Push to GitHub
2. Connect to Vercel
3. Deploy automatically

**vercel.json** (optional):
```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ]
}
```

---

### 4. DigitalOcean App Platform

#### Steps

1. Push to GitHub
2. Go to DigitalOcean Apps
3. Create New App from GitHub
4. Select repository
5. Detect as Node.js app
6. Add environment variables
7. Choose plan (Basic $5+)
8. Deploy

#### Dockerfile (Optional)
```dockerfile
FROM node:18-alpine

# Install Canvas dependencies
RUN apk add --no-cache \
    build-base \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev \
    pixman-dev

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
```

---

### 5. AWS EC2 / VPS (Ubuntu)

#### Full Setup Script

```bash
#!/bin/bash

# Update system
sudo apt-get update
sudo apt-get upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Canvas dependencies
sudo apt-get install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    pkg-config

# Install PM2
sudo npm install -g pm2

# Clone repository
cd /var/www
sudo git clone your-repo-url success-card-api
cd success-card-api

# Install dependencies
sudo npm install

# Setup PM2
pm2 start index.js --name success-card-api
pm2 save
pm2 startup

# Install Nginx (optional)
sudo apt-get install -y nginx

# Nginx config
sudo tee /etc/nginx/sites-available/success-card-api << EOF
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass https://canvas.kanata.web.id;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        
        # Increase timeout for Puppeteer
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/success-card-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup firewall
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 22
sudo ufw enable
```

---

### 6. Docker Deployment

#### Dockerfile
```dockerfile
FROM node:18-alpine

# Install Canvas dependencies
RUN apk add --no-cache \
    build-base \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev \
    pixman-dev \
    fontconfig

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

USER node

CMD ["node", "index.js"]
```

#### docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    restart: unless-stopped
    mem_limit: 512m
    cpus: 1.0
```

#### Build & Run
```bash
# Build
docker build -t success-card-api .

# Run
docker run -d -p 3000:3000 --name success-card-api success-card-api

# Or with docker-compose
docker-compose up -d
```

---

## 🔧 Production Configuration

### Environment Variables

```bash
NODE_ENV=production
PORT=3000
```

### PM2 Ecosystem File

Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'success-card-api',
    script: './index.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    merge_logs: true,
    max_memory_restart: '500M'
  }]
};
```

Run with:
```bash
pm2 start ecosystem.config.js
```

---

## 📊 Monitoring & Logging

### PM2 Monitoring
```bash
pm2 monit
pm2 logs
pm2 status
```

### Custom Logging

Add Winston:
```bash
npm install winston
```

### Health Check Monitoring

Setup cron job to ping `/health`:
```bash
*/5 * * * * curl https://canvas.kanata.web.id/health
```

---

## 🔒 Security Considerations

### 1. Rate Limiting

Add rate limiting:
```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/success', limiter);
```

### 2. Helmet for Security Headers

```bash
npm install helmet
```

```javascript
const helmet = require('helmet');
app.use(helmet());
```

### 3. CORS Configuration

```bash
npm install cors
```

```javascript
const cors = require('cors');
app.use(cors({
    origin: ['https://your-domain.com'],
    optionsSuccessStatus: 200
}));
```

---

## ⚡ Performance Optimization

### 1. Enable Compression

```bash
npm install compression
```

```javascript
const compression = require('compression');
app.use(compression());
```

### 2. Response Caching

Already implemented in controller:
```javascript
res.setHeader('Cache-Control', 'public, max-age=300');
```

### 3. Browser Instance Management

Puppeteer browser instance already uses singleton pattern for reuse.

### 4. Load Balancing

Use PM2 cluster mode or Nginx load balancing.

---

## 🐛 Troubleshooting Production

### Check Logs
```bash
pm2 logs success-card-api
tail -f /var/log/nginx/error.log
```

### Monitor Resources
```bash
htop
pm2 monit
```

### Restart Services
```bash
pm2 restart success-card-api
sudo systemctl restart nginx
```

---

## 💰 Cost Estimates

| Platform | Minimum Plan | Cost/Month | Notes |
|----------|--------------|------------|-------|
| Heroku | Hobby | $7 | Limited compute |
| Railway | Hobby | $5 | Good performance |
| DigitalOcean | Basic | $5 | Best value |
| AWS EC2 | t3.micro | ~$10 | Full control |
| VPS (Hetzner) | CX11 | €4.15 | Excellent value |

---

## 📚 Additional Resources

- [Puppeteer on AWS Lambda](https://github.com/alixaxel/chrome-aws-lambda)
- [PM2 Documentation](https://pm2.keymetrics.io/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

Made with 🚀 for production deployment

