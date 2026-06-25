//For the core quiz logic
import {sessions} from './state.js'

export function endQuestion(io, roomCode, session, qid){
	if(sessions[roomCode] !== session)return //Stop, if the room we were provided has been disbanded
	const question = session.questions.find(q => q.id === qid)
	if(!question)return
	clearTimeout(session.timer)
	session.timer = null
	session.status = 'revealed'

	for(const studentId in session.answers){
		if(session.answers[studentId] === question.correct_option) session.students[studentId].score += 100
	} 
	const tid = session.teacherSocketId
	if(tid)
		io.to(tid).emit('question_ended', {students:session.students, answers:session.answers})  

	for(const [studentId, student] of Object.entries(session.students)){
		io.to(student.socketId).emit('question_ended', 
		{selectedAnswer:session.answers[studentId], question, score:student.score})               
	}
	
}
