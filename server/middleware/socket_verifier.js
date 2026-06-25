import jwt from 'jsonwebtoken'

function verifier(socket, next){
	const token = socket.handshake.auth.token
	if(token){
		try{
			const decoded_payload = jwt.verify(token, process.env.JWT_SECRET)
			socket.teacher = decoded_payload
		}
		catch{}
	}
	next()
}
export default verifier
