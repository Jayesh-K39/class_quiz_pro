import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {socket} from './socket.js'
import Waiting from './components/Waiting'
import Card from './components/Card'
import {toast} from 'react-hot-toast'

function Student(){
	const navigate = useNavigate()
	const [status, setStatus] = useState('waiting')
	const [question, setQuestion] = useState({})
	const [endsAt, setEndsAt] = useState(null)
	const [selectedAnswer, setSelectedAnswer] = useState(null)
	const [score, setScore] = useState(0)
	useEffect(()=>{
		const name = sessionStorage.getItem('name')?.trim()
		const roomCode = sessionStorage.getItem('roomCode')?.trim()
		const studentId = sessionStorage.getItem('studentId')?.trim()
		if(!name || !roomCode || !studentId) return navigate('/join', {replace:true})
		socket.connect()

		const handleJoin = (data) => {
			setStatus(data.status)
			sessionStorage.setItem('studentId', data.studentId)
		}
		const handleIssue = ({message} = {}) =>{
			socket.disconnect()
			sessionStorage.clear()
			toast.error(message)
			navigate('/join', {replace:true})
		}
		const handleStart = ({onlyQuestion, endsAt,selectedAnswer, score}) => {
			setStatus('active');
			setQuestion(onlyQuestion)
			setEndsAt(endsAt)
			setSelectedAnswer(selectedAnswer)
			if(score)setScore(score)
		}
		const handleStop = ({selectedAnswer, question, score}) => {
			setStatus('revealed')
			setQuestion(question)
			setScore(score)
			setSelectedAnswer(selectedAnswer)
			setEndsAt(Date.now())
		}


		socket.once('join_success', handleJoin)
		socket.once('session_not_found', handleIssue)
		socket.once('room_disbanded',handleIssue)
		socket.on('question_started', handleStart)
		socket.on('question_ended', handleStop)

		socket.emit('join_room', {roomCode, name, studentId})
		document.title = 'Class Quiz Pro | Student'

		return()=>{
			socket.off('join_success', handleJoin)
			socket.off('session_not_found', handleIssue)
			socket.off('room_disbanded', handleIssue)
			socket.off('question_started', handleStart)
			socket.off('question_ended', handleStop)
		}
	}, [])

	if(status === 'waiting') return <Waiting /> 
	else return <Card question={question} endsAt={endsAt} status={status} selectedAnswer={selectedAnswer} score={score}/>
}

export default Student
