# ChatGPT Clone

A full-stack AI chatbot with user accounts. Sign up, log in, and chat with Google's Gemini model. Every user only sees their own conversation history.

**Live demo:** https://gpt-clone-seven-xi.vercel.app/

## Screenshot

![Chat screen](/frontend/public/chat-screenshot-1.png)

![Chat screen](/frontend/public/chat-screenshot-2.png)

## Features

- Email and password sign-up and login, secured with JWT
- Private chat history per user, so no one can see another account's messages
- AI answers from the Gemini API (`gemini-2.5-flash-lite`)
- Markdown rendering with syntax-highlighted code blocks
- Responsive layout: the sidebar collapses on desktop and becomes a slide-in drawer on mobile
- Rate-limited login and register endpoints
- Full Unicode support (emojis) through `utf8mb4`

## Tech Stack

**Frontend**

- React 19 + Vite
- Axios
- react-markdown + react-syntax-highlighter
- lucide-react (icons)
- CSS Modules

**Backend**

- Node.js + Express 5
- MySQL (`mysql2`)
- `@google/genai` (Gemini)
- `jsonwebtoken` and `bcryptjs` (authentication)
- `express-rate-limit`

**Deployment**

- Frontend: Vercel
- Backend: Render
- Database: Clever Cloud (MySQL)

## How It Works

```text
Browser (React)
   │  Authorization: Bearer <token>
   ▼
Express API ──► requireAuth ──► controller ──► service ──► MySQL
                                                  └──────► Gemini API
```

1. The user registers or logs in and receives a JWT.
2. The frontend attaches the token to every request through a single Axios instance.
3. `requireAuth` verifies the token and checks that the account still exists.
4. All chat queries are filtered by the logged-in user's id, so each user only reads and writes their own messages.

## Project Structure

```text
GPT-Clone/
├── backend/
│   ├── index.js              # Entry point: checks the database, starts the server
│   ├── db/                   # Database connection, schema, migrations
│   ├── scripts/              # Helper scripts
│   └── src/
│       ├── api/
│       │   ├── auth/         # Register and login (route → controller → service)
│       │   ├── chat/         # Chat history and Gemini replies
│       │   └── main.route.js
│       └── middleware/       # requireAuth, rateLimiter, errorHandler
└── frontend/
    ├── public/
    └── src/
        ├── components/       # AuthPage, Sidebar, ChatHeader, MessageList, ChatMessage, ChatInput
        ├── context/          # AuthContext (login state)
        └── services/         # api.js (Axios instance that sends the token)
```

## Getting Started

### Prerequisites

- Node.js 18 or newer
- MySQL 8
- A Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)

### 1. Clone the repo

```bash
git clone https://github.com/Kalx6/GPT-Clone.git
cd GPT-Clone
```

### 2. Set up the database

Run this in your MySQL client:

```sql
CREATE DATABASE ai_chat_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ai_chat_app;

CREATE TABLE users (
  user_id       INT AUTO_INCREMENT PRIMARY KEY,
  first_name    VARCHAR(50) NULL,
  last_name     VARCHAR(50) NULL,
  email         VARCHAR(320) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE conversations (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  role        ENUM('user', 'assistant') NOT NULL,
  content     MEDIUMTEXT NOT NULL,
  token_count INT UNSIGNED DEFAULT 0,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id     INT NULL,
  INDEX idx_conversations_user (user_id, id),
  CONSTRAINT fk_conversations_user
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Run the backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=ai_chat_app
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=a_long_random_string
```

Generate a good `JWT_SECRET` with `openssl rand -hex 48`.

```bash
npm run dev
```

The API runs at http://localhost:3000.

### 4. Run the frontend

In a second terminal:

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_BACKEND_BASE_URL=http://localhost:3000
```

```bash
npm run dev
```

The app runs at http://localhost:5173.

> Never commit your `.env` files. They contain secrets.

## API Endpoints

| Method | Endpoint                  | Auth | Description                                                  |
| ------ | ------------------------- | ---- | ------------------------------------------------------------ |
| POST   | `/api/auth/register`      | No   | Create an account (email and password, minimum 8 characters) |
| POST   | `/api/auth/login`         | No   | Log in and receive a JWT                                     |
| GET    | `/api/chat/conversations` | Yes  | Get the logged-in user's recent messages                     |
| POST   | `/api/chat/conversations` | Yes  | Send a question and get the AI's reply                       |

Protected endpoints expect the header `Authorization: Bearer <token>`.

## Security

- Passwords are hashed with bcrypt and never stored in plain text
- JWTs are signed with `HS256` and expire after 1 day
- Every request re-checks that the account still exists
- Chat data is filtered by user id on the server, not in the browser
- Login and register are limited to 10 attempts per 15 minutes per IP
- All database queries use parameters, which prevents SQL injection
- Server errors return a generic message; details stay in the server logs

## Known Limitations

- Each account has a single conversation thread. Multiple chats are not supported yet.
- The model receives your 5 most recent messages as context.
- The sidebar items (Search chats, Images, Apps, Deep research, Codex, Projects) are UI placeholders.
- The login token is stored in `localStorage`. An `httpOnly` cookie would be safer against XSS but is harder to use across separate frontend and backend domains.
- No password reset or email verification yet.

## Deployment

- **Frontend (Vercel):** set `VITE_BACKEND_BASE_URL` to the backend URL.
- **Backend (Render):** set the same variables as the backend `.env` above, with a different `JWT_SECRET` than your local one.
- **Database (Clever Cloud):** a MySQL add-on. Run the SQL from step 2 against it. Create tables with `utf8mb4`, because the default charset on some hosts rejects emojis.

## Author

**Kalid Abdulkerim**

- GitHub: [@Kalx6](https://github.com/Kalx6)
- LinkedIn: [kalid-abdulkerim](https://www.linkedin.com/in/kalid-abdulkerim-53055834b)
