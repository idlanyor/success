# Success Card API - Express.js

API berbasis Express.js untuk generate kartu sukses dengan desain modern dan gradien. Struktur modular dan terorganisir dengan baik.

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Start server
npm start

# Development mode (dengan auto-reload)
npm run dev
```

Server akan berjalan di `http://localhost:3000`

## 📚 API Documentation (Swagger)

API ini dilengkapi dengan **Swagger UI** untuk dokumentasi interaktif yang memudahkan testing dan eksplorasi API.

### Akses Swagger UI

Setelah server berjalan, buka browser dan akses:

```
http://localhost:3000/api-docs
```

### Fitur Swagger UI:
- ✅ **Interactive Testing** - Test API langsung dari browser
- ✅ **Detailed Documentation** - Deskripsi lengkap untuk setiap endpoint
- ✅ **Schema Definitions** - Model data yang jelas
- ✅ **Example Values** - Contoh parameter dan response
- ✅ **Try it Out** - Execute API calls dengan parameter custom

### Swagger JSON Specification

Untuk mengakses raw Swagger JSON specification:
```
http://localhost:3000/api-docs.json
```

Berguna untuk:
- Import ke Postman
- Generate client code
- Integration dengan tools lain

---

## 📁 Project Structure

```
scrape/
├── config/
│   ├── config.js          # Konfigurasi aplikasi (port, default values, colors, etc)
│   └── swagger.js         # Swagger/OpenAPI configuration
├── controllers/
│   └── successController.js  # Business logic untuk semua endpoints
├── middleware/
│   └── errorHandler.js    # Error handling & logging middleware
├── routes/
│   └── index.js          # Route definitions dengan JSDoc untuk Swagger
├── services/
│   └── canvasService.js  # Canvas rendering service untuk generate image
├── views/
│   └── successCard.js    # HTML template generator (untuk preview)
├── index.js              # Main entry point
├── package.json          # Dependencies (express, canvas, swagger)
├── .gitignore           # Git ignore file
├── README.md            # Documentation
├── SWAGGER.md           # Swagger usage guide
├── DEPLOYMENT.md        # Deployment guide
├── QUICK_START.md       # Quick start guide
└── ARCHITECTURE.md      # Technical architecture docs
```

### Penjelasan Struktur:

- **config/** - Semua konfigurasi aplikasi (port, default values, warna, font, dll)
- **controllers/** - Business logic dan handler untuk setiap endpoint
- **middleware/** - Middleware untuk error handling, logging, dll
- **routes/** - Definisi route/endpoint API
- **services/** - Canvas rendering service untuk generate image
- **views/** - Template HTML generator untuk preview
- **index.js** - Entry point utama aplikasi

## 🛠️ Technologies Used

- **Express.js** - Web framework
- **Node Canvas** - Native Canvas API untuk Node.js
- **Swagger UI** - API documentation
- **Node.js** - Runtime environment

### How It Works

1. User request dengan parameters
2. Generate image menggunakan Node Canvas API
3. Draw gradients, shapes, text, dan images
4. Return image buffer ke user

### System Requirements

- **Node.js**: v16+ (recommended v18+)
- **RAM**: Minimum 256MB
- **Disk**: ~100MB
- **OS**: Windows, Linux, macOS
- **Build Tools**: 
  - Windows: Visual Studio Build Tools
  - Linux: `build-essential`, `libcairo2-dev`, `libpango1.0-dev`, `libjpeg-dev`, `libgif-dev`, `librsvg2-dev`
  - macOS: Xcode Command Line Tools

## 📡 API Endpoints

### 1. Root Endpoint
```
GET /
```
Menampilkan informasi API dan daftar endpoint yang tersedia.

**Response:**
```json
{
  "name": "Success Card API",
  "version": "1.0.0",
  "endpoints": { ... }
}
```

---

### 2. Generate Success Card (Image)
```
GET /success
```
Generate kartu sukses sebagai **image (PNG/JPEG)** dengan parameter custom.

#### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `user` | string | No | @80775651303442 | Username atau ID user |
| `imageurl` | string | No | https://files.catbox.moe/5lzdmq.png | URL gambar avatar user |
| `datetime` | string | No | Minggu, 12 Oktober 2025    18:19:14 WIB | Tanggal dan waktu pesanan |
| `status` | string | No | Done | Status pesanan (ditampilkan besar) |
| `owner` | string | No | https://wa.me/6285143569870 | Link WhatsApp owner |
| `format` | string | No | png | Format image (png, jpeg, jpg) |
| `quality` | integer | No | 90 | Kualitas JPEG (1-100) |

#### Examples

**Basic PNG (default):**
```
http://localhost:3000/success
```

**Custom parameters:**
```
http://localhost:3000/success?user=@123456789&status=Success
```

**JPEG dengan quality 80:**
```
http://localhost:3000/success?format=jpeg&quality=80
```

**Full parameters:**
```
http://localhost:3000/success?user=@987654&imageurl=https://example.com/avatar.png&datetime=Senin,%2023%20Oktober%202025%2010:30:00%20WIB&status=Completed&owner=https://wa.me/6281234567890&format=png
```

**Response:**
- **Content-Type**: `image/png` atau `image/jpeg`
- **Body**: Binary image data
- **Headers**: 
  - `Content-Disposition: inline; filename="success-card.png"`
  - `Cache-Control: public, max-age=300` (5 minutes cache)

**Use Cases:**
- Embed di website: `<img src="http://localhost:3000/success?user=@test">`
- Share via WhatsApp/Telegram
- Download langsung
- Display di aplikasi mobile

---

### 2a. Generate Success Card HTML Preview
```
GET /success/html
```
Generate kartu sukses sebagai **HTML page** untuk preview/testing.

#### Parameters

Same as `/success` endpoint (except `format` and `quality`)

#### Example
```
http://localhost:3000/success/html?user=@test
```

**Response:**
HTML page dengan canvas p5.js yang menampilkan kartu sukses

**Use Case:**
- Testing tampilan sebelum generate image
- Debug rendering issues
- Lihat real-time preview

---

### 3. API Documentation
```
GET /api/info
```
Mendapatkan dokumentasi API lengkap dalam format JSON.

**Response:**
```json
{
  "name": "Success Card API",
  "version": "1.0.0",
  "documentation": { ... },
  "features": [ ... ]
}
```

---

### 4. Health Check
```
GET /health
```
Endpoint untuk mengecek status server.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-10-23T10:30:00.000Z",
  "uptime": 123.45
}
```

---

## 🎨 Fitur Desain

- ✨ **Gradien Background**: Biru ke hijau vertikal
- 🎨 **Kartu Gradien**: Kuning-hijau diagonal 55°
- 🖼️ **Avatar Circular**: Dengan border hitam 2px
- 🏅 **Success Badge**: Rotasi 25° dengan clipping circular
- 📝 **Font Custom**: 
  - Title: Bitcount Grid Single
  - Labels: Caveat Brush
  - Content: Caveat Brush
- ⭐ **Bintang Dekoratif**: Merah di kiri dan kanan
- 🎯 **Border Radius Asimetris**: 
  - Top right: 50px
  - Bottom left: 50px
  - Top left & Bottom right: 0px
- 💚 **Status Text**: Hijau dengan outline putih tebal 8px

## 🛠️ Configuration

Edit `config/config.js` untuk mengubah konfigurasi:

```javascript
module.exports = {
    port: process.env.PORT || 3000,
    defaultValues: {
        user: '@80775651303442',
        imageurl: 'https://files.catbox.moe/5lzdmq.png',
        // ... dll
    },
    canvas: {
        width: 800,
        height: 600
    }
    // ... dll
};
```

### Environment Variables

Buat file `.env` (optional):
```env
PORT=3000
NODE_ENV=development
```

## 📱 Testing

### Menggunakan Swagger UI (Recommended)
1. Start server: `npm start`
2. Buka browser: `http://localhost:3000/api-docs`
3. Pilih endpoint yang ingin di-test (contoh: `/success`)
4. Klik "Try it out"
5. Isi parameter yang diinginkan
6. Klik "Execute"
7. Lihat response di bawah

**Keuntungan:**
- Visual & user-friendly
- Tidak perlu encode URL manual
- Langsung lihat example values
- Response ditampilkan dengan syntax highlighting

### Menggunakan Browser (Direct URL)
1. Start server: `npm start`
2. Buka browser dan akses:
   - Swagger UI: `http://localhost:3000/api-docs` ⭐
   - API Info: `http://localhost:3000/`
   - Generate Card: `http://localhost:3000/success`
   - Custom: `http://localhost:3000/success?user=@test&status=Success`

### Menggunakan cURL

```bash
# Default card
curl http://localhost:3000/success

# Custom parameters
curl "http://localhost:3000/success?user=@testuser&status=Completed"

# API info
curl http://localhost:3000/api/info

# Health check
curl http://localhost:3000/health
```

### Menggunakan Postman atau Thunder Client
1. Method: `GET`
2. URL: `http://localhost:3000/success`
3. Params:
   - user: @testuser
   - imageurl: https://example.com/avatar.png
   - datetime: Senin, 23 Oktober 2025 10:30:00 WIB
   - status: Success
   - owner: https://wa.me/6281234567890

## 🔧 Development

### Menambahkan Endpoint Baru

1. **Tambahkan controller** di `controllers/`:
```javascript
// controllers/newController.js
exports.newEndpoint = (req, res) => {
    res.json({ message: 'New endpoint' });
};
```

2. **Tambahkan route** di `routes/index.js`:
```javascript
const newController = require('../controllers/newController');
router.get('/new', newController.newEndpoint);
```

### Mengubah Template

Edit file `views/successCard.js` untuk mengubah tampilan kartu.

### Mengubah Konfigurasi

Edit file `config/config.js` untuk mengubah default values, warna, font, dll.

## 🚢 Deployment

### Deploy ke Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

### Deploy ke Railway

1. Push ke GitHub
2. Connect repository di Railway
3. Railway akan auto-detect Express.js app

### Deploy ke Heroku

1. Create Heroku app:
```bash
heroku create your-app-name
```

2. Deploy:
```bash
git push heroku main
```

### Deploy ke VPS (Ubuntu)

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone & setup
git clone your-repo
cd scrape
npm install

# Start with PM2
pm2 start index.js --name success-card-api
pm2 save
pm2 startup
```

## 📝 Notes

- Semua parameter bersifat **optional** dengan nilai default
- URL untuk `imageurl` harus accessible (CORS tidak diperlukan karena server-side)
- Pastikan URL di-encode dengan benar
- Canvas size: **800x600 pixels**
- Server menggunakan Node Canvas (native Cairo binding)
- Image generation sangat cepat (~100-300ms)
- Tidak memerlukan headless browser
- Lebih ringan resource dibanding Puppeteer
- Cache: 5 minutes untuk image response
- Logging otomatis untuk setiap request
- Support PNG dan JPEG format dengan quality control

## 🐛 Error Handling

API akan mengembalikan error dalam format JSON:

```json
{
  "error": "Error type",
  "message": "Detailed error message",
  "requestedPath": "/invalid-path"
}
```

Status Codes:
- `200` - Success
- `400` - Bad request (invalid format)
- `404` - Endpoint not found
- `500` - Internal server error

### Common Errors

#### 1. Canvas Installation Issues

**Error**: `Error: Cannot find module 'canvas'` or build errors

**Solution Windows**:
```bash
# Install Visual Studio Build Tools
# https://visualstudio.microsoft.com/downloads/
# Select "Desktop development with C++"

# Then reinstall
npm install canvas
```

**Solution Linux (Ubuntu/Debian)**:
```bash
sudo apt-get update
sudo apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
npm install canvas
```

**Solution macOS**:
```bash
xcode-select --install
brew install pkg-config cairo pango libpng jpeg giflib librsvg
npm install canvas
```

#### 2. Image Loading Errors

**Error**: `Failed to load avatar` atau `Failed to load badge`

**Causes**:
- Image URL tidak accessible
- Network timeout
- Invalid image format

**Solutions**:
- Verify image URL is accessible
- Test URL in browser
- Check image format (support: JPEG, PNG, GIF)
- Use fallback placeholder if image fails

#### 3. Font Rendering Issues

**Error**: Text tidak tampil atau font tidak sesuai

**Solution**:
```javascript
// Register custom fonts (optional)
const { registerFont } = require('canvas');
registerFont('path/to/font.ttf', { family: 'FontName' });
```

#### 4. Memory Issues

**Error**: `JavaScript heap out of memory`

**Solution**:
```bash
# Increase Node.js memory
NODE_OPTIONS=--max-old-space-size=2048 npm start
```

**Note**: Canvas lebih ringan dari Puppeteer, jarang terjadi memory issues

## 🧪 Testing & Debugging

### Enable Development Mode
```bash
NODE_ENV=development npm start
```

Dalam development mode, error stack trace akan ditampilkan di response.

### Logs
Setiap request akan di-log dengan format:
```
[2025-10-23T10:30:00.000Z] GET /success
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

ISC

---

Made with ❤️ using Express.js and p5.js
