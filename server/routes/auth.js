import express from 'express'
import pool from '../db.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import verifier from '../middleware/verifier.js'
import {authLimiter} from '../middleware/rate_limiter.js'
const router = express.Router()

router.post('/login', authLimiter ,async (request, response)=>{
	const email = request.body.email?.trim()
	const password = request.body.password?.trim()
	if(!email || !password)return response.sendStatus(400)
	try{
		const [rows] = 
		await pool.query('select * from teachers where email=?', [email])
		if(rows.length === 0)
			return response.status(401).json({error:"Invalid credentials"})
		const teacher = rows[0]
		const match = await bcrypt.compare(password, teacher.password_hash)
		if(!match)
			return response.status(401).json({error:"Invalid credentials"})
		const token = jwt.sign(
		        {id:teacher.id, email:teacher.email, role:"teacher"},
		        process.env.JWT_SECRET,
		        {expiresIn:'1d'}
		)
		response.status(200).json({token})
	}
	catch(err){console.log(err); response.sendStatus(500)}
})

router.post('/register', async (request, response)=>{
	const email = request.body.email?.trim()
	const password = request.body.password?.trim()
	if(!email || !password)return response.sendStatus(400)
	try{
		const hash = await bcrypt.hash(password, 10)
		await pool.query('insert into teachers (email, password_hash) values(?, ?)',[email,hash])
		response.status(201).json({message:`Successfully registered as a teacher!`})
	}
	catch(err){
		console.log(err)
		if(err.code === 'ER_DUP_ENTRY'){
			return response.status(409).json(
			{error:"This e-mail is already linked to another account"})
		}
		response.sendStatus(500)
	}
})

router.get('/verify', verifier, (request, response)=>response.sendStatus(200))

router.get('/health', async (request, response)=>{
	try{
		await pool.query('select 1')
		response.status(200).json({status:'OK'})
	}
	catch{
		response.status(500).json({status:'Inactive'})
	}
})


export default router
