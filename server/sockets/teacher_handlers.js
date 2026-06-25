import {sessions} from './state.js'

export default function registerTeacherHandlers(io, socket){
	socket.on('rejoin_teacher', ({roomCode})=>{
		const session = sessions[roomCode]
			if(!session)return socket.emit('session_not_found', {message:`Session with room code ${roomCode} could not be found`})
			if(session.teacherId !== socket.teacher.id)return socket.emit('session_not_found', {message:`Session with room code ${roomCode} could not be found`})
			if(session.status === 'ended') return socket.emit('session_not_found', {message:`Session with room code ${roomCode} could not be found`})
			socket.join(roomCode)
			session.teacherSocketId = socket.id

			//Stop any running gracetimer and set it to null:
			clearTimeout(session.gracetimer)
			session.gracetimer = null
			socket.emit('rejoin_success', {
			    session: {
			        quizId: session.quizId,
			        questions: session.questions,
			        timePerQuestion: session.timePerQuestion,
			        activeQuestionId: session.activeQuestionId,
			        students: session.students,
			        answers:session.answers,
			        status: session.status,
			    }
			});
	})
}
