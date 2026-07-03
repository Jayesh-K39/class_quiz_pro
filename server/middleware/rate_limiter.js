import {rateLimit} from 'express-rate-limit'
export const authLimiter = rateLimit({
	windowMs:60*1000,
	limit:3,
	standardHeaders:true,
	legacyHeaders:false,
	handler:(request, response)=>{
		const remainingSeconds = Math.ceil( ( request.rateLimit.resetTime - Date.now() )/1000 )

		response.status(429).json(
		{error:`Too many attempts made. Please try again after ${remainingSeconds} seconds`})
	}
})
