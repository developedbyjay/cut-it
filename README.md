# Cut-It - URL Shortener API

A robust and scalable URL shortener service built with Node.js, TypeScript, Express.js, MongoDB, and Redis. This API allows users to create short URLs, manage their links, and track analytics.

## Features

- User registration and authentication with JWT
- URL shortening with custom or auto-generated back-halfs
- Link management (create, read, update, delete)
- User profile management
- Password reset functionality
- Rate limiting and security middleware
- Redis caching for better performance
- Comprehensive logging with Winston and Logtail
- Role-based access control (user/admin)
- Link analytics and visit tracking

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js 5.x
- **Database**: MongoDB with Mongoose ODM
- **Cache**: Redis
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Email**: Nodemailer (currently using Ethereal for testing)
- **Logging**: Winston with Logtail integration
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate limiting
- **Package Manager**: pnpm

## Prerequisites

Before running this project, make sure you have the following installed:

- Node.js (v16 or higher)
- pnpm (recommended) or npm
- MongoDB (local installation or MongoDB Atlas)
- Redis (local installation or cloud service)

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/developedbyjay/cut-it.git
   cd cut-it
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:

   ```env
   # Server Configuration
   PORT=8080
   NODE_ENV=development

   # Database Configuration
   MONGO_URI=mongodb://localhost:27017/cut-it
   # Example for MongoDB Atlas:
   # MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/cut-it

   # Redis Configuration
   REDIS_URI=redis://localhost:6379

   # JWT Secrets (generate secure random strings)
   JWT_ACCESS_SECRET=your-access-token-secret
   JWT_REFRESH_SECRET=your-refresh-token-secret
   JWT_PASSWORD_RESET_SECRET=your-password-reset-secret

   # Encryption Key (base64 encoded 32-byte key)
   ENCRYPTION_KEY=your-base64-encoded-encryption-key

   # Frontend URL (for email links and short URL generation)
   FRONTEND_URL=http://localhost:3000

   # CORS Configuration
   WHITELIST_ORIGINS=http://localhost:3000,https://yourdomain.com

   # Admin Email Whitelist (comma-separated)
   WHITELIST_EMAILS=admin@example.com,another@example.com

   # Rate Limiting
   RATE_LIMIT_WINDOW=900000

   # Logging (optional - for production)
   LOG_LEVEL=info
   LOGTAIL_SOURCE_TOKEN=your-logtail-token
   LOGTAIL_INGESTING_HOST=in.logtail.com
   ```

4. **Generate Encryption Key**
   You can generate a base64-encoded encryption key using Node.js:

   ```javascript
   const crypto = require("crypto");
   const key = crypto.randomBytes(32).toString("base64");
   console.log(key);
   ```

5. **Start MongoDB and Redis services**

   - **MongoDB**: Start your local MongoDB service or ensure your MongoDB Atlas connection is working
   - **Redis**: Start your local Redis service or use a cloud Redis service

   For Redis using Docker:

   ```bash
   docker run --name redis -d -p 6379:6379 redis/redis-stack:latest
   ```

6. **Start the development server**

   ```bash
   pnpm run dev
   ```

   The server will start at `http://localhost:8080` (or the port specified in your .env file).

## API Endpoints

### Base URL

All API endpoints are prefixed with `/v1`

### Health Check

- **GET** `/v1/` - API health check

### Authentication Routes (`/v1/auth`)

| Method | Endpoint               | Description               | Authentication Required                |
| ------ | ---------------------- | ------------------------- | -------------------------------------- |
| POST   | `/auth/register`       | Register a new user       | No                                     |
| POST   | `/auth/login`          | Login user                | No                                     |
| DELETE | `/auth/logout`         | Logout user               | Yes                                    |
| GET    | `/auth/refreshToken`   | Refresh access token      | No (requires refresh token in cookies) |
| POST   | `/auth/forgotPassword` | Send password reset email | No                                     |
| POST   | `/auth/resetPassword`  | Reset password with token | No                                     |

#### Register User

```json
POST /v1/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

#### Login User

```json
POST /v1/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Forgot Password

```json
POST /v1/auth/forgotPassword
{
  "email": "john@example.com"
}
```

#### Reset Password

```json
POST /v1/auth/resetPassword
{
  "password": "newpassword123"
}
```

### User Routes (`/v1/users`)

| Method | Endpoint         | Description                 | Authentication Required |
| ------ | ---------------- | --------------------------- | ----------------------- |
| GET    | `/users/current` | Get current user profile    | Yes                     |
| PATCH  | `/users/current` | Update current user profile | Yes                     |
| DELETE | `/users/current` | Delete current user account | Yes                     |

#### Update Current User

```json
PATCH /v1/users/current
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

### Link Routes (`/v1/links`)

| Method | Endpoint          | Description                        | Authentication Required |
| ------ | ----------------- | ---------------------------------- | ----------------------- |
| POST   | `/links/generate` | Create a new short link            | Yes                     |
| GET    | `/links/my-links` | Get user's links (with pagination) | Yes                     |
| PATCH  | `/links/:linkId`  | Update a specific link             | Yes                     |
| DELETE | `/links/:linkId`  | Delete a specific link             | Yes                     |

#### Create Short Link

```json
POST /v1/links/generate
{
  "title": "My Website",
  "destination": "https://example.com",
  "backHalf": "my-site" // Optional - will be auto-generated if not provided
}
```

#### Get My Links

```
GET /v1/links/my-links?limit=10&offset=0
```

#### Update Link

```json
PATCH /v1/links/:linkId
{
  "title": "Updated Title",
  "destination": "https://updated-example.com",
  "backHalf": "updated-site"
}
```

### Redirect Route

| Method | Endpoint     | Description              | Authentication Required |
| ------ | ------------ | ------------------------ | ----------------------- |
| GET    | `/:backHalf` | Redirect to original URL | No                      |

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. After successful login, you'll receive:

- **Access Token**: Short-lived token for API requests (sent as HTTP-only cookie)
- **Refresh Token**: Long-lived token to refresh access tokens (sent as HTTP-only cookie)

### Using the API with Authentication

Include the cookies in your requests. The authentication middleware will automatically validate the access token.

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Auth endpoints**: Stricter limits for login/register
- **Basic endpoints**: Standard limits for general API usage
- **Password reset**: Special limits for password reset functionality

## Error Handling

The API returns consistent error responses:

```json
{
  "status": "error",
  "message": "Error description",
  "errors": [] // Validation errors if any
}
```

Common HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## Development

### Project Structure

```
src/
├── @types/           # TypeScript type definitions
├── controllers/      # Route controllers
│   └── v1/          # API version 1 controllers
├── lib/             # Utility libraries (jwt, encryption, etc.)
├── middleware/      # Express middleware
├── models/          # MongoDB models
├── redis/           # Redis connection and utilities
├── routes/          # Route definitions
│   └── v1/         # API version 1 routes
├── Templates/       # Email templates
├── utils/           # Utility functions
└── server.ts        # Application entry point
```

### Scripts

- `pnpm run dev` - Start development server with hot reload
- `pnpm run test` - Run tests (not implemented yet)

### Code Style

The project uses TypeScript with strict mode enabled. Make sure to follow the existing code patterns and maintain type safety.

## Security Features

- **Helmet**: Sets various HTTP headers for security
- **CORS**: Configurable cross-origin resource sharing
- **Rate Limiting**: Prevents abuse and DDoS attacks
- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Data Encryption**: Sensitive data encryption
- **Input Validation**: Comprehensive request validation
- **HTTP-only Cookies**: Secure token storage

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Use strong, unique secrets for JWT tokens
3. Configure proper CORS origins
4. Set up MongoDB Atlas or a production MongoDB instance
5. Use Redis Cloud or a production Redis instance
6. Configure proper logging with Logtail
7. Set up proper SSL/TLS certificates
8. Configure environment variables securely

## Environment Variables Reference

| Variable                    | Description               | Required | Default                |
| --------------------------- | ------------------------- | -------- | ---------------------- |
| `PORT`                      | Server port               | No       | 8080                   |
| `NODE_ENV`                  | Environment mode          | No       | development            |
| `MONGO_URI`                 | MongoDB connection string | Yes      | -                      |
| `REDIS_URI`                 | Redis connection string   | No       | redis://localhost:6379 |
| `JWT_ACCESS_SECRET`         | JWT access token secret   | Yes      | -                      |
| `JWT_REFRESH_SECRET`        | JWT refresh token secret  | Yes      | -                      |
| `JWT_PASSWORD_RESET_SECRET` | JWT password reset secret | Yes      | -                      |
| `ENCRYPTION_KEY`            | Base64 encryption key     | Yes      | -                      |
| `FRONTEND_URL`              | Frontend application URL  | Yes      | -                      |
| `WHITELIST_ORIGINS`         | CORS allowed origins      | No       | -                      |
| `WHITELIST_EMAILS`          | Admin email whitelist     | No       | -                      |
| `RATE_LIMIT_WINDOW`         | Rate limit window (ms)    | No       | 900000                 |
| `LOG_LEVEL`                 | Logging level             | No       | info                   |
| `LOGTAIL_SOURCE_TOKEN`      | Logtail logging token     | No       | -                      |
| `LOGTAIL_INGESTING_HOST`    | Logtail host              | No       | -                      |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support or questions, please contact the maintainer or open an issue on the repository.
