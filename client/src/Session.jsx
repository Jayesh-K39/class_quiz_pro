import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { socket } from './socket.js'
import LeaderBoard from './components/LeaderBoard'
import Start from './icons/StartIcon'
import Stop from './icons/StopIcon'
import { useModal } from './wrappers/ModalProvider'
import { toast } from 'react-hot-toast'
import Shell from './components/ui/Shell'
import Panel from './components/ui/Panel'
import Button from './components/ui/Button'
import Badge from './components/ui/Badge'
import IconButton from './components/ui/IconButton'

function Session() {
	const navigate = useNavigate()
	const { confirm } = useModal()
	const [questions, setQuestions] = useState([])
	const [students, setStudents] = useState({})
	const [activeQuestionId, setActiveQuestionId] = useState(null)
	const [status, setStatus] = useState('')
	const [answers, setAnswers] = useState({})
	useEffect(() => {
		const roomCode = sessionStorage.getItem('roomCode')?.trim()
		if (!roomCode) return navigate('/controlroom', { replace: true })
		socket.connect()

		const handleSuccess = ({ session }) => {
			setQuestions(session.questions)
			setStudents(session.students)
			setAnswers(session.answers)
			setActiveQuestionId(session.activeQuestionId)
			setStatus(session.status)
			document.title = 'Class Quiz Pro | Live Session'
		}

		const handleNotFound = ({ message }) => {
			toast.error(message)
			sessionStorage.removeItem('roomCode')
			socket.disconnect()
			navigate('/controlroom', { replace: true })
		}

		const handleStudentUpdate = ({ students }) => { setStudents(students) }

		const handleDisband = () => {
			sessionStorage.clear()
			navigate('/controlroom', { replace: true })
			socket.disconnect()
		}

		const handleStop = ({ students, answers }) => {
			setStudents(students)
			setAnswers(answers)
			setStatus('revealed')
		}


		socket.once('rejoin_success', handleSuccess)
		socket.once('session_not_found', handleNotFound)
		socket.once('room_disbanded', handleDisband)
		socket.on('student_update', handleStudentUpdate)
		socket.on('question_ended', handleStop)


		socket.emit('rejoin_teacher', { roomCode })

		return () => {
			socket.off('rejoin_success', handleSuccess)
			socket.off('session_not_found', handleNotFound)
			socket.off('room_disbanded', handleDisband)
			socket.off('student_update', handleStudentUpdate)
			socket.off('question_ended', handleStop)
		}
	}, [])

	async function end() {
		const confirmation = await confirm('Are you sure you want to end the quiz? This action cannot be undone')
		if (!confirmation) return;
		const roomCode = sessionStorage.getItem('roomCode')?.trim()
		if (!roomCode) return;
		socket.emit('disband_room', { roomCode })
	}

	const roomCode = sessionStorage.getItem('roomCode')?.trim()
	const startQuestion = (qid) => {
		if (!roomCode) return;
		if (qid == null) return;
		setStatus('active')
		setActiveQuestionId(qid)
		socket.emit('start_question', { roomCode, qid: Number(qid) })
	}

	const stopQuestion = (qid) => {
		if (!roomCode) return;
		if (qid == null) return;
		socket.emit('stop_question', { roomCode, qid: Number(qid) })
	}

	const onlineStudents = Object.fromEntries(Object.entries(students).filter(([_, student]) => student.socketId))
	const onlineCount = Object.values(students).filter(student => student.socketId).length
	const question = questions.find(q => q.id === activeQuestionId)
	const correctOption = question?.correct_option ?? null
	return (

		<Shell align='top'>
			<div className="flex w-[90vw] max-w-2xl flex-col items-center gap-3 sm:flex-row sm:justify-center">
				<Badge tone="accent">
					{`${onlineCount > 0 ? onlineCount : 'No'} student${onlineCount > 1 ? 's are' : ' is'} online`}
				</Badge>

				<Badge tone="neutral">Room Code: {sessionStorage.getItem('roomCode')?.trim()}</Badge>
				<Button variant="danger" onClick={end}>End Quiz</Button>
			</div>

			<Panel tone="solid" className="w-[90vw] max-w-2xl">
				<div className="mb-2 text-center font-bold">Questions</div>
				<div className="flex flex-col gap-2">
					{questions.map((question, index) => (
						<div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3" key={question.id} id={question.id}>
							<span className="font-bold text-slate-400">Q{index + 1}.</span>
							<span className="min-w-0 flex-1 break-words">{question.question_text}</span>

							{status !== 'active' &&
								<IconButton tone="success"
									onClick={() => startQuestion(question.id)}>
									<Start />
								</IconButton>
							}

							{activeQuestionId === question.id && status === 'active' &&
								<IconButton tone="danger"
									onClick={() => stopQuestion(question.id)}>
									<Stop />
								</IconButton>
							}
						</div>
					))}
				</div>
			</Panel>

			{onlineCount > 0 && status === 'revealed' &&
				<LeaderBoard students={onlineStudents} answers={answers} correctOption={correctOption} onlineCount={onlineCount} />}
		</Shell>
	)
}

export default Session
