# Class Quiz Pro

A full duplex real-time classroom quiz platform. Teachers create accounts, build and manage reusable quizzes, then conduct live sessions that students join with a server-generated room code — with instant answer submission, live scoring, and a leaderboard.

**Live Demo:** [classquizpro.vercel.app](https://classquizpro.vercel.app)

---

## Features

### Teacher — Account & Content Management

- Register, log in, and log out
- Create, edit, and delete quizzes and questions
- Each teacher's content is fully scoped to their own account — no cross-account access

### Teacher — Live Session Control

- Create a session for any saved quiz; students join via a server-generated room code
- Control question pacing manually — start and stop each question independently
- View connected students in real time
- Reveal correct answers after each question
- View final leaderboard at the end of the session

### Student

- Join a session using a room code — no account required
- Receive questions live as the teacher activates them
- Submit answers before the teacher closes the question
- Rejoin an ongoing session after disconnection without losing progress
- View score and ranking throughout the session

---

## Tech Stack

**Frontend:** React, React Router, CSS

**Backend:** Node.js, Express.js, Socket.IO

**Database:** MySQL

**Auth:** JSON Web Tokens (JWT), bcrypt

---

## Architecture

The app has two distinct layers:

**Persistence layer (REST API):** Handles everything before a session starts — teacher registration and login, JWT-based auth middleware, and full CRUD for quizzes and questions. Authorization is enforced per-resource: a teacher can only read and modify their own quizzes.

**Live session layer (Socket.IO):** Handles everything during a running session. Session state (current question, student answers, scores) is held in server memory and never written to the database. The server is the single source of truth — clients receive state from the server on join/rejoin rather than trusting their own local state.

```
Teacher Client
      |
      |  REST (auth, quiz CRUD)
      |  WebSocket (session control)
      |
   Server
      |
      |  WebSocket (questions, scores, updates)
      |
Student Clients
```

The socket connection runs a verifier on each new connection: if the connecting socket carries a valid teacher JWT, `socket.teacher` is set to the decoded payload. Student sockets skip this block and connect normally — the verifier does not block non-teacher connections.

---

## Socket Events

### Session

| Event | Direction | Description |
|---|---|---|
| `create_session` | Teacher → Server | Teacher requests a new live session for a saved quiz |
| `session_created` | Server → Teacher | Returns the generated room code on success |
| `session_error` | Server → Teacher | Emitted if session creation fails |
| `disband_room` | Teacher → Server | Teacher ends the session |
| `room_disbanded` | Server → Room | All sockets leave the room; session deleted server-side |

### Quiz

| Event | Direction | Description |
|---|---|---|
| `start_question` | Teacher → Server | Activates the current question for the room |
| `question_started` | Server → Room | Sent to all clients when a question becomes active; also sent to a student joining mid-session if a question is currently active |
| `stop_question` | Teacher → Server | Closes the current question |
| `question_ended` | Server → Room | Sent to all clients when a question closes; also sent to a student joining mid-session if the question is in revealed state |
| `submit_question` | Student → Server | Student submits their answer |
| `submit_success` | Server → Student | Answer recorded successfully |
| `submit_error` | Server → Student | Student already answered, or question is not currently active |
| `session_not_found` | Server → Student | Emitted on submit if the session no longer exists |

### Students

| Event | Direction | Description |
|---|---|---|
| `join_room` | Student → Server | Student requests to join using a room code |
| `join_success` | Server → Student | Join confirmed; current question state synced immediately |
| `session_not_found` | Server → Student | Room code is invalid or session does not exist |
| `student_update` | Server → Teacher | Sent only to the teacher's socket when a student joins or disconnects |

### Teacher Reconnection

| Event | Direction | Description |
|---|---|---|
| `rejoin_teacher` | Teacher → Server | Emitted on every mount or refresh of the session page |
| `rejoin_success` | Server → Teacher | Teacher state restored successfully |
| `session_not_found` | Server → Teacher | Session no longer exists |

### Disconnect

If the teacher disconnects, a 60-second grace timer starts — the room is automatically disbanded if they do not reconnect within that window. If a student disconnects (whether a real student or a teacher testing from the same account), `student_update` is emitted to the teacher's socket.

---

## Project Structure

```
class_quiz_pro/
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── icons/
│       └── wrappers/
│
├── server/
│   ├── middleware/
│   ├── routes/
│   ├── sockets/
│   └── index.js
│
└── database/
    └── schema.sql
```

---

## Local Setup

### Prerequisites

- Node.js
- MySQL

### Clone and install

```bash
git clone https://github.com/Jayesh-K39/class_quiz_pro.git
cd class_quiz_pro
```

Backend:

```bash
cd server
npm install
```

Frontend:

```bash
cd client
npm install
```

## Import `database/schema.sql` into your MySQL instance

### Environment variables

Create a `.env` file in `server/` with the following:

| Variable | Description |
|---|---|
| `DB_HOST` | MySQL host |
| `DB_PORT` | MySQL port |
| `DB_USER` | MySQL user |
| `DB_PASSWORD` | MySQL password |
| `DB_NAME` | Database name |
| `JWT_SECRET` | Secret key for signing JWTs |
| `PORT` | Port for the Express server |

Create a `.env` file in `client/` with:

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend base URL (e.g. `http://localhost:5000`) |

### Run

Backend:

```bash
cd server
node index.js
```

Frontend:

```bash
cd client
npm run dev
```

---

## Challenges Solved

- Enforcing per-teacher resource ownership at the API level — a teacher cannot read or modify another teacher's quizzes or questions
- Server-authoritative session state — clients receive state from the server on join/rejoin rather than trusting their own local state
- Reconnection recovery for both teachers (grace timer + state restore) and students (rejoin without losing progress)
- Correctly syncing mid-session joins — a student who joins after a question has started or been revealed receives the right state immediately
- Preventing duplicate answer submissions and submissions to inactive questions
- Handling the edge case of a teacher joining their own session as a student

---

## Author

Jayesh Kurdukar — [GitHub](https://github.com/Jayesh-K39)
