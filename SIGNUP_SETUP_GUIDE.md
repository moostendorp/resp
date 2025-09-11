# Signup Capture Implementation Guide

## Current Implementation: CSV File Storage

We've implemented a simple CSV-based signup storage system that saves all waitlist signups to a local CSV file. This solution was chosen for its simplicity and ease of data management.

## ✅ What's Been Built

### Backend Server (`/server` directory)
- **Node.js/Express API** server running on port 3001
- **CSV file storage** at `server/signups.csv`
- **Email validation** and duplicate prevention
- **Rate limiting** (10 submissions per IP per 15 minutes)
- **Admin download endpoint** with secret key protection

### API Endpoints
```
POST /api/signup          - Submit new signup
GET  /api/signup-count    - Get total signups count
GET  /api/download-signups?key=SECRET - Download CSV file
GET  /api/health         - Server health check
```

### CSV Format
```csv
Timestamp,Email,Name,Role,Accreditation Number,Comments,IP Address
2025-09-11T08:53:48.015Z,john.doe@example.com,John Doe,aspiring,,Looking for review classes,127.0.0.1
2025-09-11T08:53:59.386Z,provider@center.ph,ABC Center,provider,PRC-12345,Want to list courses,127.0.0.1
```

## 🚀 How to Run Locally

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Start the Server
```bash
npm start
# or for development with auto-reload
npm run dev
```

### 3. Test the Form
- Open `public/signup-form.html` in browser
- Or integrate into main site (see integration section below)

### 4. View/Download Signups
- **Direct file access**: `server/signups.csv`
- **API download**: `http://localhost:3001/api/download-signups?key=your-secret-key-here`
- **Open in Excel/Google Sheets**: Import CSV directly

## 🔐 Security Configuration

### Change Secret Key
Edit `server/server.js` line 126:
```javascript
// Change from:
if (secretKey !== 'your-secret-key-here') {
// To something secure:
if (secretKey !== 'my-unique-secret-2025') {
```

### Environment Variables (Production)
Create `.env` file:
```env
PORT=3001
SECRET_KEY=your-actual-secret-key
NODE_ENV=production
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=10
```

## 🌐 Deployment Options

### Option 1: GitHub Pages + External API
**Frontend**: GitHub Pages (static files only)
**Backend**: Must be hosted elsewhere

#### Free Backend Hosting Options:
1. **Render.com** (Recommended)
   - Free tier available
   - Auto-deploys from GitHub
   - Steps:
     ```bash
     1. Push server code to GitHub
     2. Connect Render to your repo
     3. Set build command: npm install
     4. Set start command: node server.js
     ```

2. **Railway.app**
   - $5 free credit/month
   - One-click deploy
   - PostgreSQL available if needed

3. **Cyclic.sh**
   - Free Node.js hosting
   - Automatic HTTPS
   - Built-in storage

4. **Vercel**
   - Serverless functions
   - Requires slight code modification

### Option 2: Your Own Server (VPS)

#### Requirements:
- Linux server (Ubuntu/Debian)
- Node.js 16+
- SSH access

#### Deployment Steps:
```bash
# 1. Upload to server
scp -r server/ user@your-server:/home/user/resp-api

# 2. SSH and install
ssh user@your-server
cd resp-api
npm install

# 3. Install PM2 (process manager)
npm install -g pm2

# 4. Start with PM2
pm2 start server.js --name resp-api
pm2 startup
pm2 save

# 5. Open firewall port
sudo ufw allow 3001
```

#### Nginx Reverse Proxy (Optional):
```nginx
server {
    listen 80;
    server_name api.resp.ph;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### Add SSL:
```bash
sudo certbot --nginx -d api.resp.ph
```

### Option 3: Serverless (No CSV)
If you can't run a Node.js server, consider:

1. **Formspree** (Easiest)
   ```html
   <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```

2. **Netlify Forms**
   ```html
   <form netlify>
   ```

3. **Web3Forms**
   ```html
   <form action="https://api.web3forms.com/submit" method="POST">
   ```

## 📝 Frontend Integration

### Add to Main Site (index.html)

Replace the current Mailchimp form with:

```html
<!-- In the signup section -->
<form class="signup-form" id="signupForm">
    <div class="form-row">
        <div class="form-group">
            <label for="email">Email *</label>
            <input type="email" id="email" name="email" required>
        </div>
        <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" name="name">
        </div>
    </div>
    <div class="form-group">
        <label for="role">Role</label>
        <select id="role" name="role">
            <option value="">Select role</option>
            <option value="aspiring">Aspiring Professional</option>
            <option value="licensed">Licensed Professional</option>
            <option value="provider">Provider/University</option>
        </select>
    </div>
    <button type="submit" class="cta-button">Join Waitlist</button>
</form>

<script>
// Update API_URL based on your deployment
const API_URL = 'http://localhost:3001/api'; // Development
// const API_URL = 'https://api.resp.ph/api'; // Production

document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        email: document.getElementById('email').value,
        name: document.getElementById('name').value,
        role: document.getElementById('role').value
    };
    
    try {
        const response = await fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        if (result.success) {
            alert(result.message);
            e.target.reset();
        } else {
            alert(result.message || 'Error occurred');
        }
    } catch (error) {
        alert('Cannot connect to server');
    }
});
</script>
```

## 📊 Data Management

### Export to Other Systems
The CSV format makes it easy to:
- Import to **Google Sheets** (File → Import)
- Upload to **Mailchimp** (Audience → Import)
- Import to **CRM systems** (Salesforce, HubSpot)
- Process with **Excel** or any spreadsheet tool

### Backup Strategy
```bash
# Manual backup
cp server/signups.csv backups/signups_$(date +%Y%m%d).csv

# Automated daily backup (cron)
0 2 * * * cp /path/to/signups.csv /backups/signups_$(date +\%Y\%m\%d).csv
```

## 🧪 Testing

### Test Submission (curl)
```bash
curl -X POST http://localhost:3001/api/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "role": "aspiring"
  }'
```

### Expected Response
```json
{
  "success": true,
  "message": "Thank you for joining our waitlist! We'll be in touch soon."
}
```

### Test Results (Verified)
✅ Server starts correctly on port 3001
✅ CSV file created with proper headers
✅ Signups saved with all fields
✅ Duplicate email prevention works
✅ Rate limiting prevents spam
✅ Download endpoint with secret key works

## 🔧 Troubleshooting

### Server won't start
- Check if port 3001 is in use: `lsof -i :3001`
- Kill existing process: `kill -9 [PID]`

### Can't write to CSV
- Check file permissions: `chmod 644 signups.csv`
- Ensure directory is writable

### CORS errors
- Update CORS origin in server.js for production domain
- Add your domain to allowed origins

### Form not submitting
- Check if server is running: `http://localhost:3001/api/health`
- Verify API_URL in frontend matches server address
- Check browser console for errors

## 📈 Monitoring

### View signup count
```bash
# Via API
curl http://localhost:3001/api/signup-count

# Via command line
wc -l server/signups.csv
```

### Watch real-time signups
```bash
tail -f server/signups.csv
```

## 🚀 Production Checklist

- [ ] Change secret key from default
- [ ] Set up environment variables
- [ ] Configure CORS for production domain
- [ ] Set up SSL certificate
- [ ] Configure firewall rules
- [ ] Set up PM2 or systemd service
- [ ] Enable automated backups
- [ ] Test form submission from production
- [ ] Monitor server logs
- [ ] Set up error alerting

## 💡 Future Enhancements

Consider adding:
- Email notifications on new signup
- Admin dashboard for viewing signups
- Export to Google Sheets API
- Webhook integration
- Database storage (PostgreSQL/MySQL)
- Email verification
- CAPTCHA for spam prevention

## Need Help?

- **Server Issues**: Check `server/server.js` and logs
- **CSV Issues**: Verify file permissions and path
- **Frontend Issues**: Check browser console and network tab
- **Deployment**: Follow platform-specific guides above

---

*Last Updated: September 2025*
*Tested and Verified: All functionality working*