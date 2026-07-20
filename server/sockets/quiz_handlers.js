import {sessions} from './state.js'
import {endQuestion} from './quiz_logic.js'

export default function registerQuizHandlers(io, socket){

// A question is started by the teacher: -------------------------------------------------------------------------------------------
	 socket.on('start_question', ({roomCode, qid})=>{
        	if(!socket.teacher)return;

        	const session = sessions[roomCode]
        	if(!session || session.teacherId !== socket.teacher.id)return;
        	if(socket.id !== session.teacherSocketId)return;

        	if(['active', 'ended'].includes(session.status))return;

        	const question = session.questions.find(q => q.id === qid)
        	if(!question)return;
        	session.activeQuestionId = qid
        	session.status = 'active'
        	session.answers = {}

 			//Setting up the logic for when the question ends:
        	const time = session.timePerQuestion*1000
        	clearTimeout(session.timer)
        	session.timer = setTimeout(()=>{endQuestion(io, roomCode, session, qid)}, time)

			//Logic for emitting the question to the students:
        	const {correct_option, ...onlyQuestion} = question
        	session.endsAt = Date.now() + time
        	io.to(roomCode).emit('question_started', {onlyQuestion,endsAt:session.endsAt})
	})

// A question is stopped by the teacher: -------------------------------------------------------------------------------------------
	socket.on('stop_question', ({roomCode, qid})=>{
		if(!socket.teacher)return;
		const session = sessions[roomCode]
		if(!session || session.teacherId !== socket.teacher.id)return;
		if(socket.id !== session.teacherSocketId)return;

		if(session.activeQuestionId === null || 
		session.activeQuestionId !== qid)return;

		if(session.status === 'ended') return
		endQuestion(io, roomCode, session, qid)
	})



// Submission of an answer by student: -------------------------------------------------------------------------------------------

	socket.on('submit_answer', ({roomCode, qid, answer})=>{
 		const session = sessions[roomCode]
 		if(!session)return socket.emit('session_not_found', {message:'This session could not be found'})
        if(!socket.studentId || !(socket.studentId in session.students))return;

        if(!['A', 'B', 'C', 'D'].includes(answer))return;

        if(socket.studentId in session.answers)
        	return socket.emit('submit_error', {message:"You have already submitted an answer to this question"})
        	
		if(session.activeQuestionId === null || session.activeQuestionId !== qid)
			return socket.emit('submit_error', {message:'This question is not active'})

        session.answers[socket.studentId] = answer
        socket.emit('submit_success', {answer})
})
}
