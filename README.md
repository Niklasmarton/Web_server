# Chirpy

A RESTful HTTP server built with Node.js, Express, and PostgreSQL. Chirpy is a Twitter-like microblogging API where users can create short posts ("chirps"), authenticate with JWTs, and manage their accounts.

## Tech Stack

- **Runtime:** Node.js (ESM)
- **Framework:** Express
- **Database:** PostgreSQL via [Drizzle ORM](https://orm.drizzle.team/)
- **Auth:** JWT (access tokens) + opaque refresh tokens
- **Password hashing:** Argon2

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
DB_URL=postgres://<user>:<password>@localhost:5432/<dbname>?sslmode=disable
PLATFORM=dev
JWT_SECRET=<your_secret>
POLKA_KEY=<your_polka_api_key>
```

> `PLATFORM=dev` enables the admin reset endpoint. Do not use in production.

### Running

```bash
npm run build && npm start
```

The server listens on `http://localhost:8080`.

---

## API Reference

### Authentication

Protected endpoints require a JWT access token in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

Endpoints using API key authentication require:

```
Authorization: ApiKey <api_key>
```

---

### Users

#### `POST /api/users`

Create a new user.

**Request body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response `201`:**
```json
{
  "id": "uuid",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "email": "user@example.com",
  "isChirpyRed": false
}
```

---

#### `PUT /api/users`

Update the authenticated user's email and/or password.

**Auth:** Bearer token required

**Request body:**
```json
{
  "email": "new@example.com",
  "password": "newpassword"
}
```

**Response `200`:**
```json
{
  "id": "uuid",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "email": "new@example.com",
  "isChirpyRed": false
}
```

---

### Authentication

#### `POST /api/login`

Authenticate a user and receive access and refresh tokens.

**Request body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response `200`:**
```json
{
  "id": "uuid",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "email": "user@example.com",
  "token": "<jwt_access_token>",
  "refreshToken": "<refresh_token>",
  "isChirpyRed": false
}
```

**Response `401`:** Invalid credentials.

---

#### `POST /api/refresh`

Exchange a valid refresh token for a new JWT access token.

**Auth:** Bearer token required (refresh token)

**Response `200`:**
```json
{
  "token": "<new_jwt_access_token>"
}
```

**Response `401`:** Refresh token is invalid, expired, or revoked.

---

#### `POST /api/revoke`

Revoke a refresh token.

**Auth:** Bearer token required (refresh token)

**Response `204`:** No content.

---

### Chirps

#### `POST /api/chirps`

Create a new chirp. Chirps are limited to 140 characters. Profane words (`kerfuffle`, `sharbert`, `fornax`) are automatically replaced with `****`.

**Auth:** Bearer token required

**Request body:**
```json
{
  "body": "Hello world!"
}
```

**Response `201`:**
```json
{
  "id": "uuid",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "body": "Hello world!",
  "userId": "uuid"
}
```

**Response `400`:** Missing body or chirp exceeds 140 characters.

---

#### `GET /api/chirps`

Retrieve all chirps.

**Query parameters:**

| Parameter  | Type   | Description                                |
|------------|--------|--------------------------------------------|
| `authorId` | string | Filter chirps by user ID                   |
| `sort`     | string | Sort order: `asc` (default) or `desc`      |

**Response `200`:** Array of chirp objects.

---

#### `GET /api/chirps/:chirpId`

Retrieve a single chirp by ID.

**Response `200`:**
```json
{
  "id": "uuid",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "body": "Hello world!",
  "userId": "uuid"
}
```

**Response `404`:** Chirp not found.

---

#### `DELETE /api/chirps/:chirpId`

Delete a chirp. Only the author can delete their own chirps.

**Auth:** Bearer token required

**Response `204`:** No content.

**Response `401`:** Not authenticated.

**Response `403`:** Authenticated user is not the author.

---

### Webhooks

#### `POST /api/polka/webhooks`

Webhook endpoint for the Polka payment provider. Upgrades a user to Chirpy Red on a `user.upgraded` event.

**Auth:** ApiKey required

**Request body:**
```json
{
  "event": "user.upgraded",
  "data": {
    "userId": "uuid"
  }
}
```

**Response `204`:** No content (success or unrecognised event).

**Response `401`:** Invalid API key.

**Response `404`:** User not found.

---

### Admin

> These endpoints are only available when `PLATFORM=dev`.

#### `GET /admin/healthz`

Health check endpoint.

**Response `200`:** `OK`

#### `GET /admin/metrics`

Returns the number of times the `/app` file server has been hit.

**Response `200`:** Plain text hit count.

#### `POST /admin/reset`

Resets the file server hit counter and deletes all users from the database.

**Response `200`:** `OK hits were reset`
