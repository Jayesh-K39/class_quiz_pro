import verifier from '../middleware/socket_verifier.js'
import { sessions } from './state.js'
import registerTeacherHandlers from './teacher_handlers.js'
import registerStudentHandlers from './student_handlers.js'
import registerSessionHandlers from './session_handlers.js'
import registerQuizHandlers from './quiz_handlers.js'
import registerDisconnectHandler from './disconnect_handler.js'

export default function initSocket(io){
	io.use(verifier)
	io.on('connection', (socket)=>{
	        registerSessionHandlers(io, socket)
	        registerTeacherHandlers(io, socket)
	        registerStudentHandlers(io, socket)
	        registerQuizHandlers(io, socket)
	        registerDisconnectHandler(io, socket)
	})
}
