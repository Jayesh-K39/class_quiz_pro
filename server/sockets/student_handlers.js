import {limiter} from '../middleware/join_limiter.js'
import {sessions} from './state.js'

export default function registerStudentHandlers(io, socket){
	socket.on('join_room', async ({roomCode, name, studentId})=>{
		// try{
			// await limiter.consume(socket.handshake.address)
			const session = sessions[roomCode]
			if(!session)return socket.emit('session_not_found', {message:'This session could not found'})
			if(session.status === 'ended') return socket.emit('session_not_found', {message: 'This session could not be found'})

			if(studentId && studentId in session.students){
				socket.studentId = studentId
				socket.roomCode = roomCode
				socket.join(roomCode)
				session.students[studentId].socketId = socket.id //Update their socketId field

				socket.emit('join_success', {status:session.status, studentId})
				if(session.activeQuestionId !== null){
					const currentQuestion = session.questions.find(q => q.id === session.activeQuestionId)
					const {correct_option, ...onlyQuestion} = currentQuestion
					const score = session.students[socket.studentId].score

					if(session.status === 'active'){
						const answer = session.answers[socket.studentId]
						socket.emit('question_started', {onlyQuestion, endsAt:session.endsAt, selectedAnswer: answer??null, score})
					}
					else if(session.status === 'revealed'){
						socket.emit('question_ended', 
						{selectedAnswer: session.answers[socket.studentId], question:currentQuestion, score})
					}
				}
				const tid = session.teacherSocketId
				if(tid)io.to(tid).emit('student_update', {students:session.students})
				return;
			}

			socket.studentId = crypto.randomUUID()
			socket.roomCode = roomCode
			session.students[socket.studentId] = {name, score:0, socketId:socket.id}
			socket.join(roomCode)

			const tid = session.teacherSocketId
			if(tid) io.to(tid).emit('student_update', {students:session.students})

		 	socket.emit('join_success', {status:session.status, studentId:socket.studentId})
		 	if(session.activeQuestionId !== null){
				const currentQuestion = session.questions.find(q => q.id === session.activeQuestionId)
				const {correct_option, ...onlyQuestion} = currentQuestion

		 		if(session.status === 'active'){
					socket.emit('question_started', {onlyQuestion, endsAt:session.endsAt, score:0})
		 		}
		 		else if(session.status === 'revealed'){
		 			socket.emit('question_ended', {selectedAnswer: session.answers[socket.studentId], question:currentQuestion, score:0})
		 		}
		 	}
		// }catch(info){
			// socket.emit('session_error', {error:`Too many attempts made. Please try again after ${Math.ceil(info.msBeforeNext/1000)} seconds`})
		// }
	})
}










