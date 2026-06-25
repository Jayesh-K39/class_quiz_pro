import {sessions} from './state.js'
import generator from '../generator.js'
import {disbandRoom} from './session_logic.js'
import pool from '../db.js'

export default function registerSessionHandlers(io, socket){
	socket.on('create_session', async ({quizId, timePerQuestion})=>{
		if(!socket.teacher) return socket.emit('session_error',
		{message:'This connection is unauthorized to create a session'})
	
		const teacherId = socket.teacher.id
		try{
			const [questions] = await pool.query('select * from questions where quiz_id=?', [quizId])
			if(questions.length === 0) return socket.emit('session_error', {message:'No questions found'})
			let roomCode;
			do{roomCode = generator()}while(roomCode in sessions)
			sessions[roomCode] = {teacherId, quizId, questions, timePerQuestion, timer:null, 
			activeQuestionId:null,
			teacherSocketId:socket.id,
			students:{}, answers:{}, status:'waiting'}
	
			socket.join(roomCode)
			socket.emit('session_created', {roomCode})
		}catch{socket.emit('session_error', {message:'Internal Server Error'})}
	})


	socket.on('disband_room', ({roomCode})=>{
		if(!socket.teacher)return;
		const session = sessions[roomCode]
		if(!session || session.teacherId !== socket.teacher.id)return;
		if(socket.id !== session.teacherSocketId)return;
		disbandRoom(io, roomCode)
	})
}
