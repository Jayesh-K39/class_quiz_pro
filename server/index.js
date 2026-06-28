import express from 'express'
import cors from 'cors'
import {createServer} from 'http'
import authRouter from './routes/auth.js'
import quizzRouter from './routes/quizzes.js'
import questionRouter from './routes/questions.js'
import verifier from './middleware/verifier.js'
import {Server} from 'socket.io'
import initSocket from './sockets/index.js'

const app = express()
app.use(express.json())
app.use(cors({origin:process.env.CORS_ORIGIN || 'http://localhost:5173'}))
const server = createServer(app)
const io = new Server(server, 
{cors:{origin:process.env.CORS_ORIGIN || 'http://localhost:5173'}})
initSocket(io)

// ----------------------------------------------------------------------
app.use('/', authRouter)
app.use('/quizzes', quizzRouter)
app.use('/questions', questionRouter)
// ----------------------------------------------------------------------
const PORT = process.env.PORT || 5000
server.listen(PORT,'0.0.0.0', ()=>console.log(`Server running on port: ${PORT}`))
