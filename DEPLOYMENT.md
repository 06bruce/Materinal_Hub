# Deployment Guide

This guide covers different deployment options for the Maternal Health Hub application.

## 🚀 Quick Start with Docker

### Prerequisites
- Docker and Docker Compose installed
- Git installed

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Materinal_Hub
   ```

2. **Set up environment variables**
   ```bash
   # Copy environment templates
   cp backend/env-template.txt backend/.env
   cp frontend/env-template.txt frontend/.env
   
   # Edit the files with your production values
   nano backend/.env
   nano frontend/.env
   ```

3. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - MongoDB: localhost:27017

## 🐳 Docker Deployment

### Build and Run Individual Services

#### Backend
```bash
cd backend
docker build -t maternal-health-backend .
docker run -d -p 3001:3001 --name backend maternal-health-backend
```

#### Frontend
```bash
cd frontend
docker build -t maternal-health-frontend .
docker run -d -p 3000:80 --name frontend maternal-health-frontend
```

### Environment Variables for Docker

Create a `.env` file in the root directory:
```env
# Database
MONGODB_URI=mongodb://admin:password123@mongodb:27017/maternal-health?authSource=admin

# Backend
JWT_SECRET=your-super-secret-jwt-key-change-in-production
CHATBASE_API_KEY=your-chatbase-api-key
CHATBASE_BOT_ID=your-chatbase-bot-id
NODE_ENV=production

# Frontend
REACT_APP_API_URL=http://localhost:3001
```

## ☁️ Cloud Deployment

### AWS Deployment

#### Using EC2
1. Launch an EC2 instance (t3.medium or larger)
2. Install Docker and Docker Compose
3. Clone the repository
4. Set up environment variables
5. Run `docker-compose up -d`

#### Using ECS (Elastic Container Service)
1. Push images to ECR
2. Create ECS cluster
3. Create task definitions
4. Set up load balancer
5. Configure auto-scaling

### Google Cloud Platform

#### Using Cloud Run
1. Build and push images to Container Registry
2. Deploy to Cloud Run
3. Set up Cloud SQL for MongoDB
4. Configure environment variables

### DigitalOcean

#### Using App Platform
1. Connect your GitHub repository
2. Configure build and run commands
3. Set environment variables
4. Deploy automatically

## 🔧 Manual Deployment

### Backend Deployment

1. **Server Setup**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install MongoDB
   wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

2. **Application Setup**
   ```bash
   # Clone repository
   git clone <repository-url>
   cd Materinal_Hub/backend
   
   # Install dependencies
   npm install
   
   # Set up environment
   cp env-template.txt .env
   nano .env
   
   # Start with PM2
   npm install -g pm2
   pm2 start server.js --name "maternal-health-backend"
   pm2 startup
   pm2 save
   ```

### Frontend Deployment

1. **Build the application**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Serve with Nginx**
   ```bash
   # Install Nginx
   sudo apt install nginx
   
   # Copy built files
   sudo cp -r build/* /var/www/html/
   
   # Configure Nginx
   sudo nano /etc/nginx/sites-available/maternal-health
   ```

   Nginx configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/html;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
       
       location /api {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. **Enable the site**
   ```bash
   sudo ln -s /etc/nginx/sites-available/maternal-health /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

## 🔒 SSL/HTTPS Setup

### Using Let's Encrypt (Certbot)

1. **Install Certbot**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   ```

2. **Obtain SSL certificate**
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

3. **Auto-renewal**
   ```bash
   sudo crontab -e
   # Add: 0 12 * * * /usr/bin/certbot renew --quiet
   ```

## 📊 Monitoring and Logging

### Application Monitoring

1. **PM2 Monitoring**
   ```bash
   pm2 monit
   pm2 logs
   ```

2. **System Monitoring**
   ```bash
   # Install htop
   sudo apt install htop
   htop
   ```

### Log Management

1. **View logs**
   ```bash
   # Application logs
   tail -f backend/logs/app.log
   tail -f backend/logs/error.log
   
   # Nginx logs
   sudo tail -f /var/log/nginx/access.log
   sudo tail -f /var/log/nginx/error.log
   ```

2. **Log rotation**
   ```bash
   sudo nano /etc/logrotate.d/maternal-health
   ```

## 🔄 Backup and Recovery

### Database Backup

1. **MongoDB Backup**
   ```bash
   # Create backup
   mongodump --db maternal-health --out /backup/mongodb/
   
   # Restore backup
   mongorestore --db maternal-health /backup/mongodb/maternal-health/
   ```

2. **Automated Backup Script**
   ```bash
   #!/bin/bash
   BACKUP_DIR="/backup/mongodb/$(date +%Y%m%d_%H%M%S)"
   mkdir -p $BACKUP_DIR
   mongodump --db maternal-health --out $BACKUP_DIR
   
   # Keep only last 7 days of backups
   find /backup/mongodb -type d -mtime +7 -exec rm -rf {} +
   ```

### Application Backup

1. **Code Backup**
   ```bash
   # Create tarball
   tar -czf maternal-health-backup-$(date +%Y%m%d).tar.gz /path/to/application
   ```

## 🚨 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Find process using port
   sudo netstat -tulpn | grep :3001
   
   # Kill process
   sudo kill -9 <PID>
   ```

2. **MongoDB connection issues**
   ```bash
   # Check MongoDB status
   sudo systemctl status mongod
   
   # Restart MongoDB
   sudo systemctl restart mongod
   ```

3. **Permission issues**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER /path/to/application
   chmod +x start-dev.sh
   ```

## 📈 Performance Optimization

### Backend Optimization

1. **Enable compression**
2. **Use Redis for caching**
3. **Optimize database queries**
4. **Implement connection pooling**

### Frontend Optimization

1. **Enable gzip compression**
2. **Use CDN for static assets**
3. **Implement service workers**
4. **Optimize images**

## 🔐 Security Checklist

- [ ] Change default passwords
- [ ] Enable HTTPS
- [ ] Configure firewall
- [ ] Set up monitoring
- [ ] Regular security updates
- [ ] Database access restrictions
- [ ] API rate limiting
- [ ] Input validation
- [ ] Error handling
- [ ] Log monitoring

## 📞 Support

For deployment issues:
1. Check the logs
2. Verify environment variables
3. Test database connectivity
4. Check network configuration
5. Contact the development team
