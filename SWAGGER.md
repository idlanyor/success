# Swagger Documentation Guide

## 📚 Overview

API ini menggunakan **Swagger/OpenAPI 3.0** untuk dokumentasi interaktif. Swagger UI menyediakan interface visual untuk explore dan test API tanpa perlu tools external.

## 🚀 Akses Swagger UI

### Local Development
```
https://canvas.kanata.web.id/api-docs
```

### Production
```
https://your-domain.com/api-docs
```

### Swagger JSON Specification
```
https://canvas.kanata.web.id/api-docs.json
```

## 🎯 Cara Menggunakan Swagger UI

### 1. Explore Endpoints

Saat membuka Swagger UI, Anda akan melihat semua endpoints yang tersedia, dikelompokkan berdasarkan tags:

- **Success Card** - Endpoint untuk generate success card
- **Info** - Informasi dan dokumentasi API
- **Health** - Health check endpoints

### 2. Expand Endpoint

Klik pada endpoint untuk melihat detail:
- Description
- Parameters
- Request body (jika ada)
- Response codes
- Response schema
- Example values

### 3. Try It Out

**Langkah-langkah:**

1. Klik tombol **"Try it out"** di pojok kanan atas
2. Form parameter akan menjadi editable
3. Isi parameter yang diinginkan (atau gunakan default values)
4. Klik tombol **"Execute"**
5. Lihat hasil di section **"Responses"**:
   - Response body
   - Response headers
   - HTTP status code
   - cURL command equivalent

### 4. Understanding Response

Response ditampilkan dengan:
- **Syntax highlighting** untuk JSON
- **Copy button** untuk copy response
- **Download button** untuk download response
- **cURL command** untuk replicate request

## 📝 Endpoint Details

### GET /success

Generate success card dengan custom parameters.

**Parameters:**
```yaml
user:
  type: string
  required: false
  default: "@80775651303442"
  example: "@123456789"
  description: Username atau ID user

imageurl:
  type: string (URI)
  required: false
  default: "https://files.catbox.moe/5lzdmq.png"
  example: "https://example.com/avatar.png"
  description: URL gambar avatar (harus CORS-enabled)

datetime:
  type: string
  required: false
  default: "Minggu, 12 Oktober 2025    18:19:14 WIB"
  example: "Senin, 23 Oktober 2025 10:30:00 WIB"
  description: Tanggal dan waktu pesanan

status:
  type: string
  required: false
  default: "Done"
  example: "Success"
  description: Status pesanan (text hijau besar)

owner:
  type: string (URI)
  required: false
  default: "https://wa.me/6285143569870"
  example: "https://wa.me/6281234567890"
  description: Link WhatsApp owner
```

**Responses:**
- **200 OK** - HTML page dengan success card
- **500 Internal Server Error** - Gagal generate card

### GET /

API overview dengan list endpoints.

**Responses:**
- **200 OK** - JSON object dengan API info

### GET /api/info

Detailed API documentation dalam JSON.

**Responses:**
- **200 OK** - Complete API documentation

### GET /health

Health check endpoint.

**Responses:**
- **200 OK** - Server status, timestamp, uptime

## 🔧 Configuration

Swagger configuration terletak di `config/swagger.js`.

### Mengubah Title & Description

```javascript
info: {
    title: 'Success Card API',
    version: '1.0.0',
    description: 'Your description here'
}
```

### Menambah Server

```javascript
servers: [
    {
        url: 'https://canvas.kanata.web.id',
        description: 'Development'
    },
    {
        url: 'https://your-domain.com',
        description: 'Production'
    }
]
```

### Custom CSS

Di `index.js`:
```javascript
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Your Title',
    customfavIcon: 'your-icon-url'
}));
```

## 📖 JSDoc Annotations

Dokumentasi Swagger di-generate dari JSDoc comments di `routes/index.js`.

### Example Route Documentation

```javascript
/**
 * @swagger
 * /your-endpoint:
 *   get:
 *     summary: Short description
 *     description: Detailed description
 *     tags: [TagName]
 *     parameters:
 *       - in: query
 *         name: paramName
 *         schema:
 *           type: string
 *         required: false
 *         description: Parameter description
 *     responses:
 *       200:
 *         description: Success response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/YourSchema'
 */
router.get('/your-endpoint', controller.yourHandler);
```

## 🎨 Schema Definitions

Schemas didefinisikan di `config/swagger.js` dalam `components.schemas`.

### Example Schema

```javascript
schemas: {
    YourSchema: {
        type: 'object',
        properties: {
            field1: {
                type: 'string',
                example: 'value1'
            },
            field2: {
                type: 'number',
                example: 123
            }
        }
    }
}
```

## 🔄 Reusable Components

### Menggunakan $ref

```javascript
responses:
    200:
        content:
            application/json:
                schema:
                    $ref: '#/components/schemas/YourSchema'
```

### Common Responses

```javascript
responses: {
    NotFound: {
        description: 'Resource not found',
        content: {
            'application/json': {
                schema: { /* ... */ }
            }
        }
    }
}
```

Gunakan:
```javascript
responses:
    404:
        $ref: '#/components/responses/NotFound'
```

## 🚀 Export & Import

### Export Swagger Spec

1. Buka `https://canvas.kanata.web.id/api-docs.json`
2. Save as JSON file
3. Import ke tools lain

### Import ke Postman

1. Buka Postman
2. Click "Import"
3. Paste URL: `https://canvas.kanata.web.id/api-docs.json`
4. Click "Import"
5. Collection akan ter-create otomatis

### Generate Client Code

Gunakan tools seperti:
- **Swagger Codegen**
- **OpenAPI Generator**

```bash
# Install
npm install -g @openapitools/openapi-generator-cli

# Generate JavaScript client
openapi-generator-cli generate \
  -i https://canvas.kanata.web.id/api-docs.json \
  -g javascript \
  -o ./generated-client
```

## 📊 Best Practices

### 1. Clear Descriptions
```javascript
description: 'Generate kartu sukses dengan parameter custom. Semua parameter optional dengan default values.'
```

### 2. Provide Examples
```javascript
example: "@123456789"
```

### 3. Document All Responses
```javascript
responses:
    200: { /* success */ }
    400: { /* bad request */ }
    500: { /* server error */ }
```

### 4. Use Tags for Organization
```javascript
tags: [Success Card]
```

### 5. Reference Common Schemas
```javascript
schema:
    $ref: '#/components/schemas/Error'
```

## 🐛 Troubleshooting

### Swagger UI Not Loading

**Check:**
1. Server running? `npm start`
2. Port correct? `https://canvas.kanata.web.id/api-docs`
3. Dependencies installed? `npm install`

### Changes Not Reflecting

**Solution:**
1. Restart server (Ctrl+C, then `npm start`)
2. Hard refresh browser (Ctrl+Shift+R)
3. Clear browser cache

### JSDoc Not Working

**Check:**
1. JSDoc syntax correct?
2. Path di `swagger.js` correct?
   ```javascript
   apis: ['./routes/*.js', './controllers/*.js']
   ```
3. Restart server after changes

## 📚 Resources

- [Swagger/OpenAPI Specification](https://swagger.io/specification/)
- [swagger-jsdoc Documentation](https://github.com/Surnet/swagger-jsdoc)
- [swagger-ui-express Documentation](https://github.com/scottie1984/swagger-ui-express)
- [OpenAPI 3.0 Guide](https://swagger.io/docs/specification/about/)

## 💡 Tips

1. **Use Swagger UI for Testing** - Faster than cURL or Postman
2. **Document as You Code** - Add JSDoc while writing routes
3. **Keep Schemas Organized** - Use $ref for reusability
4. **Provide Good Examples** - Helps users understand API
5. **Test via Swagger** - Ensure docs match implementation

---

Made with 📚 using Swagger/OpenAPI 3.0

