import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { socket } from '../socket.js'
import DeleteIcon from '../icons/delIcon'
import EditIcon from '../icons/EditIcon'
import StartIcon from '../icons/StartIcon'
import { useModal } from '../wrappers/ModalProvider'
import { toast } from 'react-hot-toast'
import Panel from './ui/Panel'
import Button from './ui/Button'
import IconButton from './ui/IconButton'

function QuizList({ onSelect }) {
	const { confirm, prompt } = useModal()
	const navigate = useNavigate()
	const [quizzes, setQuizzes] = useState([])

	async function getQuizzes() {
		const response = await fetch(`${import.meta.env.VITE_API_URL}/quizzes`, {
			method: 'GET',
			headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }

		})
		if (!response.ok) return;
		const data = await response.json()
		setQuizzes(data.quizzes)
	}

	async function create() {
		const title = await prompt('Enter the title for your quiz here: ')

		if (!title) return;
		const response = await fetch(`${import.meta.env.VITE_API_URL}/quizzes`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
			body: JSON.stringify({ title })
		})
		if (!response.ok) return;
		getQuizzes()
	}

	async function edit(id) {
		const quiz = quizzes.find(q => q.id === id)
		const update = await prompt('Enter the updated title for the quiz here: ', quiz.title)
		if (!update) return;
		const response = await fetch(`${import.meta.env.VITE_API_URL}/quizzes/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
			body: JSON.stringify({ update })
		})
		if (!response.ok) return;
		getQuizzes()
	}

	async function Delete(id, title) {
		const confirmation = await confirm(`Are you sure you want to delete the quiz titled: '${title}'?`)
		if (!confirmation) return;
		const response = await fetch(`${import.meta.env.VITE_API_URL}/quizzes/${id}`, {
			method: 'DELETE',
			headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
		})
		if (!response.ok) return;
		getQuizzes()
	}

	async function launch(quizId) {
		let time = await prompt('How many seconds should each question take?')
		if (time === false) return;
		time = Number(time)
		if (!time) return toast.error('Please enter a valid time limit');
		if (!Number.isInteger(time) || time <= 0) return toast.error('Please enter positive integer time limit only (e.g. 10,20,30,etc.)');
		socket.connect()
		socket.emit('create_session', { quizId, timePerQuestion: time })
		socket.once('session_created', ({ roomCode }) => {
			sessionStorage.setItem('roomCode', roomCode)
			navigate('/session', { replace: true })
		})

		socket.once('session_error', ({ message }) => {
			socket.disconnect()
			toast.error(message)
		})
	}

	useEffect(() => { getQuizzes() }, [])
	return (
		<Panel tone="solid" className="flex max-h-[80vh] w-[90vw] max-w-lg flex-col gap-3">
			<div className="text-center font-bold">
				{quizzes.length > 0 ? 'Your Quizzes' : 'No quizzes created yet 😴'}
			</div>

			<div className="flex flex-col gap-2 overflow-y-auto">
				{quizzes.map((quiz, index) => (
					<div key={quiz.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition hover:border-violet-500/40 hover:bg-violet-500/10" onClick={() => onSelect({ id: quiz.id, title: quiz.title })}>
						<span className="font-bold text-slate-400">{index + 1}.</span>
						<span className="min-w-0 flex-1 break-words">{quiz.title}</span>

						<IconButton tone="danger"
							onClick={(e) => { e.stopPropagation(); Delete(quiz.id, quiz.title) }}>
							<DeleteIcon />
						</IconButton>

						<IconButton tone="accent"
							onClick={(e) => { e.stopPropagation(); edit(quiz.id) }}>
							<EditIcon />
						</IconButton>

						<IconButton tone="success"
							onClick={(e) => { e.stopPropagation(); launch(quiz.id) }}>
							<StartIcon />
						</IconButton>
					</div>

				))}
			</div>

			<Button className="w-full" onClick={create}>+ Create a new Quiz</Button>
		</Panel>
	)
}
export default QuizList
