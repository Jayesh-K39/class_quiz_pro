//Logic regarding the session itself:
import {sessions} from './state.js'
export async function disbandRoom(io,roomCode){
	const session = sessions[roomCode]
	if(!session)return;

	io.to(roomCode).emit('room_disbanded', { message: 'The quiz has ended.' })
	const socketsInRoom = await io.in(roomCode).fetchSockets();
	for (const socket of socketsInRoom){
	  socket.leave(roomCode);
	}
	clearTimeout(session.timer);
	clearTimeout(session.gracetimer);
	session.timer = null
	session.gracetimer = null
	session.activeQuestionId = null
	delete sessions[roomCode]
}
