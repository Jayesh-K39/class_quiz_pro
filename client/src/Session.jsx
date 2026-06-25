import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {socket} from './socket.js'
import LeaderBoard from './components/LeaderBoard'
import Start from './icons/StartIcon'
import Stop from './icons/StopIcon'
import {toast} from 'react-hot-toast'

function Session(){
	const navigate = useNavigate()
	const [questions, setQuestions] = useState([])
	const [students, setStudents] = useState({})
	const [activeQuestionId, setActiveQuestionId] = useState(null)
	const [status, setStatus] = useState('')
	const [answers, setAnswers] = useState({})
	useEffect(()=>{
		if(!sessionStorage.getItem('roomCode'))return navigate('/controlroom', {replace:true})
		const roomCode = sessionStorage.getItem('roomCode')
		socket.connect()
		
		const handleSuccess = ({session}) =>{
			setQuestions(session.questions)
			setStudents(session.students)
			setAnswers(session.answers)
			setActiveQuestionId(session.activeQuestionId)
			setStatus(session.status)
			document.title = 'Class Quiz Pro | Live Session'
		}

		const handleNotFound = ({message}) => {
			toast.error(message)
			sessionStorage.removeItem('roomCode')
			socket.disconnect()
			navigate('/controlroom', {replace:true})
		}

		const handleStudentUpdate = ({students}) => {setStudents(students)}

		const handleDisband = ({message}) =>{
			sessionStorage.clear()
			navigate('/controlroom', {replace:true})
			socket.disconnect()
		}

		const handleStop = ({students, answers}) =>{
			setStudents(students)
			setAnswers(answers)
			setStatus('revealed')
		}
		

		socket.once('rejoin_success', handleSuccess)
		socket.once('session_not_found', handleNotFound)
		socket.once('room_disbanded', handleDisband)
		socket.on('student_update', handleStudentUpdate)
		socket.on('question_ended', handleStop)


		socket.emit('rejoin_teacher', {roomCode})

		return()=>{ 
			socket.off('rejoin_success', handleSuccess)
			socket.off('session_not_found', handleNotFound)
			socket.off('room_disbanded',handleDisband)
			socket.off('student_update', handleStudentUpdate)
			socket.off('question_ended', handleStop)
		}
	}, [])

	const end = () =>{
		const confirmation = confirm('Are you sure you want to end the quiz? This action cannot be undone')
		if(!confirmation)return;
		const roomCode = sessionStorage.getItem('roomCode')
		if(!roomCode)return;
		socket.emit('disband_room', {roomCode}) 
	}

	const roomCode = sessionStorage.getItem('roomCode')
	const startQuestion = (qid) =>{
		if(!roomCode)return;
		if(qid == null)return;
		setStatus('active')
		setActiveQuestionId(qid)
		socket.emit('start_question', {roomCode, qid:Number(qid)})
	}

	const stopQuestion = (qid) =>{
		if(!roomCode)return;
		if(qid == null)return;
		socket.emit('stop_question', {roomCode, qid:Number(qid)})
	}

	const bodyStyle = `min-h-screen bg-[#ca38cf] p-6 flex flex-col`
	const holder = `w-[90vw] max-w-2xl flex flex-col gap-2 p-6 bg-white mx-auto my-4 rounded-md`
	const upperDiv = `w-[90vw] max-w-2xl flex flex-col self-center justify-center sm:flex-row items-center gap-3 p-3`
	const btnStyle = `rounded-md bg-red-500 text-white cursor-pointer hover:bg-red-600 p-3 font-bold` 


	const divStyle = `bg-gray-300 p-3 rounded-md flex items-center gap-3`
	const helper = `w-8 h-8 shrink-0 flex justify-center items-center cursor-pointer hover:bg-green-300 rounded-md`

	const onlineCount = Object.values(students).filter(student => student.socketId).length

	const question = questions.find(q => q.id === activeQuestionId)
	const correctOption = question?.correct_option ?? null
	return(

		<div className={bodyStyle}>

			<div className={upperDiv}>
				<span className='text-black bg-white p-3 rounded-md font-bold'>
				{`${onlineCount > 0 ? onlineCount : 'No'} student${onlineCount > 1 ? 's are' : ' is'} online`}</span>

				<span className='p-3 rounded-md bg-white font-bold'>RoomCode : {sessionStorage.getItem('roomCode')}</span>
				<button className={btnStyle} onClick={end}>End Quiz</button>
			</div>

			<div className={holder}>
				<span className='text-center font-bold'>Questions</span>
				{questions.map((question, index)=>(
					<div className={divStyle} key={question.id} id={question.id}>
						<span>Q{index+1}.</span>
						<span className='flex-1 break-words'>{question.question_text}</span>

						{status !== 'active' && 
						<button className={helper} 
						onClick={()=>startQuestion(question.id)}>
							<Start/>
						</button>
						}

						{activeQuestionId === question.id && status === 'active' && 
						<button className={helper}
						onClick={()=>stopQuestion(question.id)}>
							<Stop/>
						</button>
						}
					</div>
				))}
			</div>

		{onlineCount > 1 && status==='revealed' && <LeaderBoard students={students} answers={answers} correctOption={correctOption}
		onlineCount={onlineCount}/>}
		</div>
	)
}

export default Session
