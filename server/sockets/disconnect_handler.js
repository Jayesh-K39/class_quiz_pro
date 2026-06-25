import {sessions} from './state.js'
import {disbandRoom} from './session_logic.js'


export default function registerDisconnectHandler(io, socket){
	socket.on('disconnect', ()=>{
		if(socket.teacher){
			const roomCode = Object.keys(sessions).find( code => sessions[code].teacherId === socket.teacher.id)
			if(!roomCode)return
			const session = sessions[roomCode]

			if(socket.id === session.teacherSocketId){
				session.gracetimer = setTimeout(()=>{
				        if(!sessions[roomCode])return;
				        disbandRoom(io, roomCode)
				}, 60000)
			}
			else{
				const student = session.students[socket.studentId]
				if(student && student.socketId === socket.id){student.socketId = null}
				const tid = session.teacherSocketId
				if(!tid)return
				io.to(tid).emit('student_update', {students:session.students})
			}
		}
		else{
			const roomCode = socket.roomCode
			const session = sessions[roomCode]
			if(!session)return
			const student = session.students[socket.studentId]
			if(student && student.socketId === socket.id){student.socketId = null}
			const tid = session.teacherSocketId
			if(!tid)return
			io.to(tid).emit('student_update', {students:session.students})
		}
	})
}
