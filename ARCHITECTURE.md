# Architecture Documentation

## 📐 Struktur Aplikasi

Aplikasi ini menggunakan arsitektur **MVC (Model-View-Controller)** yang dimodifikasi untuk API service.

```
┌─────────────────────────────────────────┐
│           Client Request                 │
│      (HTTP GET /success?params)          │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│          index.js (Entry Point)          │
│   - Express app initialization          │
│   - Middleware setup                    │
│   - Route registration                  │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│        Middleware Layer                  │
│   - Logger (request logging)            │
│   - JSON parser                         │
│   - URL encoded parser                  │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│          Routes (routes/)                │
│   - Route definitions                   │
│   - Map URLs to controllers             │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│      Controllers (controllers/)          │
│   - Request handling                    │
│   - Business logic                      │
│   - Response formatting                 │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│         Views (views/)                   │
│   - HTML template generation            │
│   - Dynamic content injection           │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│      Config (config/)                    │
│   - Default values                      │
│   - Application settings                │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│         Response to Client               │
│   - HTML (success card)                 │
│   - JSON (API info/errors)              │
└─────────────────────────────────────────┘
```

## 📂 Komponen Utama

### 1. Entry Point (`index.js`)
**Tanggung jawab:**
- Initialize Express application
- Setup middleware
- Configure Swagger UI
- Register routes
- Start server
- Handle graceful shutdown

**Dependencies:**
- express
- swagger-ui-express
- config/config.js
- config/swagger.js
- routes/index.js
- middleware/errorHandler.js

### 2. Configuration (`config/config.js`)
**Tanggung jawab:**
- Define application settings
- Store default values
- Manage colors, fonts, canvas size
- Export configuration object

**No dependencies** - Pure configuration

### 2a. Swagger Configuration (`config/swagger.js`)
**Tanggung jawab:**
- Define OpenAPI 3.0 specification
- Configure Swagger UI settings
- Define schemas and components
- Set API metadata (title, version, description)
- Configure servers (dev/prod)

**Dependencies:**
- swagger-jsdoc
- config/config.js

### 3. Routes (`routes/index.js`)
**Tanggung jawab:**
- Define API endpoints
- Map URLs to controller functions
- Document endpoints with JSDoc for Swagger
- Export router

**Dependencies:**
- express.Router()
- controllers/successController.js

**JSDoc Integration:**
Routes file contains JSDoc comments yang di-parse oleh swagger-jsdoc untuk generate OpenAPI specification.

### 4. Controllers (`controllers/successController.js`)
**Tanggung jawab:**
- Handle business logic
- Process request parameters
- Call view generators
- Format responses
- Handle errors

**Dependencies:**
- views/successCard.js
- config/config.js

### 5. Views (`views/successCard.js`)
**Tanggung jawab:**
- Generate HTML templates
- Inject dynamic data
- Escape user input
- Return HTML string

**Dependencies:**
- config/config.js

### 6. Middleware (`middleware/errorHandler.js`)
**Tanggung jawab:**
- Log requests
- Handle 404 errors
- Handle 500 errors
- Format error responses

**No major dependencies**

## 🔄 Request Flow

### Example: GET /success?user=@test&status=Done

```
1. Client Request
   └─> GET /success?user=@test&status=Done

2. index.js
   └─> Logger middleware logs request
   └─> Routes to appropriate handler

3. routes/index.js
   └─> Matches /success route
   └─> Calls successController.generateCard

4. controllers/successController.js
   └─> Extracts query parameters
   └─> Calls generateSuccessCardHTML(params)

5. views/successCard.js
   └─> Gets config from config/config.js
   └─> Merges parameters with defaults
   └─> Escapes user input
   └─> Generates HTML with embedded JavaScript
   └─> Returns HTML string

6. controllers/successController.js
   └─> Sets Content-Type header
   └─> Sends HTML response

7. Client Response
   └─> Receives HTML
   └─> Browser renders p5.js canvas
   └─> Success card displayed
```

## 🔐 Security Measures

### Input Sanitization
```javascript
// views/successCard.js
const escapeQuotes = (str) => str.replace(/'/g, "\\'");
```
- Escapes single quotes to prevent JavaScript injection
- Applied to all user inputs (user, datetime, status, owner, imageurl)

### Error Handling
```javascript
// middleware/errorHandler.js
- Catches all errors
- Logs to console
- Returns safe error messages
- Hides stack trace in production
```

### CORS Consideration
- imageurl must be CORS-enabled
- p5.js loadImage() requires proper CORS headers

## 🎯 Design Patterns

### 1. **MVC Pattern**
- **Model**: config/config.js (data/settings)
- **View**: views/successCard.js (presentation)
- **Controller**: controllers/successController.js (logic)

### 2. **Middleware Pattern**
- Request → Middleware chain → Route handler
- Logging, parsing, error handling

### 3. **Factory Pattern**
- `generateSuccessCardHTML()` acts as factory
- Creates HTML instances based on parameters

### 4. **Singleton Pattern**
- Express app instance
- Config object

## 📊 Data Flow

```
URL Parameters
      ↓
Query String Parser (Express)
      ↓
Controller (merge with defaults)
      ↓
View Generator (template + data)
      ↓
HTML String
      ↓
HTTP Response
      ↓
Client Browser
      ↓
p5.js Canvas Rendering
      ↓
Visual Success Card
```

## 🔧 Extensibility Points

### Adding New Parameters
1. Add to `config/config.js` defaultValues
2. Update controller to extract new parameter
3. Update view template to use new parameter
4. Update documentation

### Adding New Endpoints
1. Create handler in controller
2. Add route in `routes/index.js`
3. Update documentation

### Adding Middleware
1. Create middleware function
2. Register in `index.js`
3. Use in specific routes or globally

### Customizing Template
1. Edit `views/successCard.js`
2. Modify p5.js drawing functions
3. Adjust colors/fonts in config

## 🧪 Testing Strategy

### Unit Tests
- Test each controller function
- Test view generator with various inputs
- Test middleware functions

### Integration Tests
- Test complete request flow
- Test error handling
- Test parameter validation

### E2E Tests
- Test actual HTTP requests
- Test browser rendering
- Test various parameter combinations

## 📈 Performance Considerations

### Caching
- Config is loaded once at startup
- No database queries needed
- Pure computation in views

### Memory
- No persistent state
- Stateless design
- Each request is independent

### Scalability
- Horizontally scalable (add more instances)
- No shared state between instances
- Load balancer friendly

## 🚀 Deployment Architecture

```
┌─────────────────────────┐
│    Load Balancer        │
│    (Nginx/HAProxy)      │
└──────────┬──────────────┘
           │
    ┌──────┴──────┐
    │             │
┌───▼───┐    ┌───▼───┐
│ App   │    │ App   │
│Instance│   │Instance│
│  #1   │    │  #2   │
└───────┘    └───────┘
```

### Recommended Setup
- Reverse proxy (Nginx)
- Process manager (PM2)
- Multiple instances
- Auto-restart on crash
- Request logging
- Health check monitoring

## 📝 Maintenance

### Updating Dependencies
```bash
npm outdated
npm update
```

### Monitoring
- Use PM2 for process monitoring
- Log aggregation (Winston, Morgan)
- Error tracking (Sentry)
- Performance monitoring (New Relic)

### Backup & Recovery
- Git version control
- Config backup
- Regular testing
- Rollback strategy

