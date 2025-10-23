# Quick Start Guide

Panduan cepat untuk mulai menggunakan Success Card API.

## ⚡ 5-Minute Setup

### 1. Install Dependencies
```bash
npm install
```

**Note**: Canvas package will compile native bindings (requires build tools).

**Build Tools Required:**
- **Windows**: Visual Studio Build Tools
- **Linux**: `build-essential`, `libcairo2-dev`, `libpango1.0-dev`
- **macOS**: Xcode Command Line Tools

### 2. Start Server
```bash
npm start
```

Server akan berjalan di `https://canvas.kanata.web.id`

### 3. Test API

**Generate Image (PNG):**
```
https://canvas.kanata.web.id/success
```

**Preview HTML:**
```
https://canvas.kanata.web.id/success/html
```

**Swagger UI:**
```
https://canvas.kanata.web.id/api-docs
```

## 🎯 Common Use Cases

### 1. Basic Usage
```html
<img src="https://canvas.kanata.web.id/success" alt="Success Card">
```

### 2. Custom User & Status
```
https://canvas.kanata.web.id/success?user=@john_doe&status=Completed
```

### 3. JPEG Format with Quality
```
https://canvas.kanata.web.id/success?format=jpeg&quality=80
```

### 4. Full Customization
```
https://canvas.kanata.web.id/success?user=@alice&imageurl=https://example.com/avatar.jpg&datetime=Monday,%20Oct%2023,%202025&status=Shipped&owner=https://wa.me/123456789&format=png
```

## 📱 Integration Examples

### HTML
```html
<img src="https://canvas.kanata.web.id/success?user=@test&status=Done" 
     alt="Success Card" 
     width="800" 
     height="600">
```

### WhatsApp Share
```javascript
const imageUrl = 'http://your-domain.com/success?user=@test&status=Success';
const whatsappUrl = `https://wa.me/?text=Check%20this%20out!%20${encodeURIComponent(imageUrl)}`;
window.open(whatsappUrl);
```

### Download Image
```javascript
const downloadImage = async () => {
    const response = await fetch('/success?user=@test');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'success-card.png';
    a.click();
};
```

### React Component
```javascript
function SuccessCard({ user, status }) {
    const imageUrl = `https://canvas.kanata.web.id/success?user=${encodeURIComponent(user)}&status=${encodeURIComponent(status)}`;
    
    return (
        <img 
            src={imageUrl} 
            alt={`Success card for ${user}`}
            loading="lazy"
        />
    );
}
```

### Node.js Backend
```javascript
const axios = require('axios');
const fs = require('fs');

async function generateCard(params) {
    const response = await axios.get('https://canvas.kanata.web.id/success', {
        params: params,
        responseType: 'arraybuffer'
    });
    
    fs.writeFileSync('success-card.png', response.data);
    console.log('Card generated!');
}

generateCard({ user: '@test', status: 'Done' });
```

## 🔑 Quick Parameter Reference

| Parameter | Example | Description |
|-----------|---------|-------------|
| `user` | `@john_doe` | Username/ID |
| `imageurl` | `https://...jpg` | Avatar URL |
| `datetime` | `Monday, Oct 23, 2025` | Date/time |
| `status` | `Success` | Status text |
| `owner` | `https://wa.me/123` | Owner link |
| `format` | `png` or `jpeg` | Image format |
| `quality` | `90` | JPEG quality (1-100) |

## 🚀 Development Tips

### Hot Reload
```bash
npm run dev
```

### Test Swagger UI
```
https://canvas.kanata.web.id/api-docs
```

### Check Health
```bash
curl https://canvas.kanata.web.id/health
```

### View Logs
Server logs appear in console with timestamps:
```
[2025-10-23T10:30:00.000Z] GET /success
```

## 🐛 Quick Troubleshooting

### Problem: Canvas build error saat install
**Solution Windows:**
```bash
# Install Visual Studio Build Tools
# https://visualstudio.microsoft.com/downloads/
npm install canvas
```

**Solution Linux:**
```bash
sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
npm install canvas
```

### Problem: Image generation lambat
**Cause**: Downloading external images (avatar, badge)
**Solution**: Use CDN atau cache images locally

### Problem: Image tidak tampil
**Solution**: Check imageurl is accessible, test in browser first

### Problem: Font tidak sesuai
**Solution**: System akan fallback ke Arial jika custom fonts tidak tersedia

## 📚 Next Steps

1. ✅ Read full [README.md](README.md) untuk detailed documentation
2. ✅ Explore [Swagger UI](https://canvas.kanata.web.id/api-docs) untuk interactive testing
3. ✅ Check [DEPLOYMENT.md](DEPLOYMENT.md) untuk production deployment
4. ✅ Review [ARCHITECTURE.md](ARCHITECTURE.md) untuk technical details

## 💡 Pro Tips

- Use `/success/html` untuk preview sebelum generate image
- Cache image responses di client side (5 minutes cache header)
- Use PNG untuk quality, JPEG untuk file size
- Encode special characters di URL parameters
- Test imageurl CORS sebelum use di production

---

Happy coding! 🎉

