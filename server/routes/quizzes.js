import verifier from '../middleware/verifier.js'
import express from 'express'
import pool from '../db.js'
const router = express.Router()

router.get('/', verifier, async (request, response)=>{
	try{
		const [quizzes] = 
		await pool.query('select * from quizzes where teacher_id=?',[request.teacher.id])
		response.status(200).json({quizzes})
	}
	catch{response.sendStatus(500)}
})

router.post('/', verifier, async (request, response)=>{
	const title = request.body.title?.trim()
	if(!title)return response.sendStatus(400)
	try{
		await pool.query('insert into quizzes (teacher_id, title) values(?,?)',
		[request.teacher.id,title])
		response.sendStatus(201)
	}
	catch{
		response.sendStatus(500)
	}
})

router.put('/:id', verifier, async (request, response)=>{
	const update = request.body.update?.trim()
	if(!update)return response.sendStatus(400)
	try{
		const [result] = await pool.query('update quizzes set title=? where id=? and teacher_id=?', 
		[update, request.params.id,request.teacher.id])
		if(result.affectedRows === 0)
			return response.sendStatus(404)
		response.sendStatus(200)
	}
	catch{response.sendStatus(500)}
})

router.delete('/:id', verifier, async (request, response)=>{
	try{
		const [result] = await pool.query('delete from quizzes where id=? and teacher_id=?',
		[request.params.id, request.teacher.id])
		if(result.affectedRows === 0)
			return response.sendStatus(404)
		response.sendStatus(200)
	}
	catch{response.sendStatus(500)}	
})

router.get('/:id/questions', verifier, async (request, response)=>{
	try{
		const [quiz] = await pool.query('select * from quizzes where id=? and teacher_id=?',
		[request.params.id, request.teacher.id])
		if(quiz.length === 0) return response.sendStatus(403)
		const [questions] =
		await pool.query('select * from questions where quiz_id=?',[request.params.id])
		response.status(200).json({questions})
	}
	catch{response.sendStatus(500)}
})


router.post('/:id/questions', verifier, async (request, response)=>{
	const question_text = request.body.question_text?.trim()
	const option_a = request.body.option_a?.trim()
	const option_b = request.body.option_b?.trim()
	const option_c = request.body.option_c?.trim()
	const option_d = request.body.option_d?.trim()
	const correct_option = request.body.correct_option?.trim()

	const fields = [question_text, option_a, option_b, option_c, option_d, correct_option]
	if(fields.some(field => !field))
		return response.status(400).json({error:'None of the options can be empty'})
	
	if(!['A', 'B', 'C', 'D'].includes(correct_option))
		return response.status(400).json({error:'The correct option shall only include either A,B,C or D'})

	const options = [option_a, option_b, option_c, option_d]
	if(new Set(options).size !== options.length){
		return response.status(400).json({error:"All the options must be unique"})
	}

	try{
		const [quiz] = await pool.query('select * from quizzes where id=? and teacher_id=?',
		[request.params.id, request.teacher.id])
		if(quiz.length === 0) return response.status(403).json({error:'Invalid quiz id'})
		const [countResult] = await pool.query('Select count(*) as count from questions where quiz_id=?',[request.params.id])
		const order_index = countResult[0].count
		await pool.query(`insert into questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, order_index)
		values(?,?,?,?,?,?,?,?)`,
		[request.params.id, question_text, option_a, option_b, option_c, option_d, correct_option, order_index])
	
		response.status(201).json({message:'Question Created'})
	}
	catch{response.status(500).json({error:'Server Error. Please Stand By...'})}
})


export default router
