import jwt from 'jsonwebtoken'

function verifier(request, response, next){
	const header = request.headers.authorization
	if(!header) return response.sendStatus(401)
	if(!header.startsWith('Bearer '))return response.sendStatus(401)
	const token = header.slice(7)
	try{
		const decoded_payload = jwt.verify(token, process.env.JWT_SECRET)
		request.teacher = decoded_payload
		next()
	}
	catch{response.sendStatus(401)}
}

export default verifier
