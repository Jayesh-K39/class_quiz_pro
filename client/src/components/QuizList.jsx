import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {socket} from '../socket.js'
import DeleteIcon from '../icons/delIcon'
import EditIcon from '../icons/EditIcon'
import StartIcon from '../icons/StartIcon'
import {useModal} from '../wrappers/ModalProvider'
import {toast} from 'react-hot-toast'

function QuizList({onSelect}){
	const {confirm, prompt} = useModal()
	const navigate = useNavigate()
	const [quizzes, setQuizzes] = useState([])
	const holder = `flex flex-col gap-2 w-[90vw] max-w-lg rounded-md bg-white p-6 max-h-[80vh]`
	const divStyle = `bg-gray-300 hover:bg-gray-400 p-3 rounded-md cursor-pointer flex items-center gap-3`
	const btnStyle = `cursor-pointer p-3 bg-green-500 rounded-md hover:bg-green-600 `
	const helpBtn = `w-8 h-8 flex rounded-md justify-center items-center shrink-0 cursor-pointer`
	
	async function getQuizzes(){
		const response = await fetch(`${import.meta.env.VITE_API_URL}/quizzes`,{
			method:'GET',
			headers:{'Authorization':`Bearer ${localStorage.getItem('token')}`}
	
		})
		if(!response.ok)return;
		const data = await response.json()
		setQuizzes(data.quizzes)
	}

	async function create(){
		const title = await prompt('Enter the title for your quiz here: ')
		
		if(!title)return;
		console.log(title.length)
		const response = await fetch(`${import.meta.env.VITE_API_URL}/quizzes`,{
			method:'POST',
			headers:{'Content-Type':'application/json', 'Authorization':`Bearer ${localStorage.getItem('token')}`},
			body:JSON.stringify({title})
		})
		if(!response.ok)return;
		getQuizzes()
	}

	async function edit(id){
		const quiz = quizzes.find(q => q.id === id)
		const update = await prompt('Enter the updated title for the quiz here: ', quiz.title)
		if(!update)return;
		const response = await fetch(`${import.meta.env.VITE_API_URL}/quizzes/${id}`,{
			method:'PUT',
			headers:{'Content-Type':'application/json', 'Authorization':`Bearer ${localStorage.getItem('token')}`},
			body:JSON.stringify({update})
		})
		getQuizzes()
	}

	async function Delete(id, title){
		const confirmation = await confirm(`Are you sure you want to delete the quiz titled: '${title}'`)
		if(!confirmation)return;
		await fetch(`${import.meta.env.VITE_API_URL}/quizzes/${id}`, {
			method:'DELETE',
			headers:{'Authorization':`Bearer ${localStorage.getItem('token')}`}
		})
		getQuizzes()
	}

	async function launch(quizId){
		let time = await prompt('How many seconds should each question take?')
		if(time===false)return;
		time = Number(time)
		if(!time)return toast.error('Please enter a valid time limit');
		if(!Number.isInteger(time) || time <= 0)return toast.error('Please enter positive integer time limit only (e.g. 10,20,30,etc.)');
		socket.connect()
		socket.emit('create_session', {quizId, timePerQuestion:time})
		socket.once('session_created', ({roomCode})=>{
			sessionStorage.setItem('roomCode', roomCode)
			navigate('/session',{replace:true})
		})

		socket.once('session_error', ({message})=>{
			socket.disconnect()
			toast.error(message)
		})

	}

	useEffect(()=>{getQuizzes()}, [])
	return(
		<div className={holder}>
			<div className='text-center font-bold p-3'>
				{quizzes.length > 0 ? 'QUIZZES': 'No quizzes created yet 😴'}
			</div>

			<div className='flex flex-col gap-2 overflow-y-scroll'>
			{quizzes.map((quiz, index)=>(
				<div key={quiz.id} className={divStyle} onClick={()=>onSelect({id:quiz.id, title:quiz.title})}>
					<span className='font-bold'>{index+1}.</span>
					<span className='flex-1 min-w-0 break-words'>{quiz.title}</span>

					<button className={`${helpBtn} hover:bg-red-500`}
					onClick={(e)=>{e.stopPropagation();Delete(quiz.id, quiz.title)}}>
						<DeleteIcon/>
					</button>

					<button className={`${helpBtn} hover:bg-blue-400`}
					onClick={(e)=>{e.stopPropagation(); edit(quiz.id)}}>
						<EditIcon/>
					</button>

					<button className={`${helpBtn} hover:bg-green-300`}
					onClick={(e)=>{e.stopPropagation(); launch(quiz.id)}}>
						<StartIcon/>
					</button>
				</div>

			))} 
			</div>


			<button className={btnStyle} onClick={create}>+ Create a new Quiz</button>
		</div>
	)
}
export default QuizList
