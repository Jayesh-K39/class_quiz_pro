import express from 'express'
import verifier from '../middleware/verifier.js'
import pool from '../db.js'
const router = express.Router()

router.put('/:id', verifier, async (request, response)=>{
	const update = request.body.update?.trim()
	if(!update)return response.sendStatus(400)
	try{
		const [question] = await pool.query(
		`SELECT 1 FROM questions q
		 JOIN quizzes qz ON q.quiz_id = qz.id
		 WHERE q.id=? AND qz.teacher_id=?`,
		[request.params.id, request.teacher.id])
		if (question.length === 0) return response.sendStatus(403)
		await pool.query('update questions set question_text=? where id=?', [update, request.params.id])
		response.sendStatus(200)
	}
	catch{response.sendStatus(500)}
})

router.delete('/:id', verifier, async (request, response)=>{
	try{
		const [question] = await pool.query(
		  `SELECT 1 FROM questions q
		   JOIN quizzes qz ON q.quiz_id = qz.id
		   WHERE q.id=? AND qz.teacher_id=?`,
		  [request.params.id, request.teacher.id]
		)
		if (question.length === 0) return response.sendStatus(403)
		
		await pool.query('delete from questions where id=?',[request.params.id])
		response.sendStatus(200)
	}
	catch{response.sendStatus(500)}
})

export default router
