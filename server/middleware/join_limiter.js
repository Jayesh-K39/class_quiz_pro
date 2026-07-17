import {RateLimiterMemory} from 'rate-limiter-flexible'
export const limiter = new RateLimiterMemory({
	points:3,
	duration:60,
})
