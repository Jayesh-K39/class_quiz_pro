import { socket } from '../socket.js'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Tick from '../icons/Tick'
import Cross from '../icons/Cross'
import { useModal } from '../wrappers/ModalProvider'
import Shell from './ui/Shell'
import Panel from './ui/Panel'
import Button from './ui/Button'
import Badge from './ui/Badge'

function Card({ question, endsAt, status, selectedAnswer, score }) {

	//States: ----------------------------------------------------
	const navigate = useNavigate()
	const { confirm } = useModal()
	const [confirmed, setConfirmed] = useState(false)
	const [message, setMessage] = useState('')
	const [selected, setSelected] = useState(null)

	//Socket listeners regarding submission----------------------------------------------------
	useEffect(() => {
		const handleError = ({ message }) => { setMessage(message) }
		const handleSuccess = ({ answer }) => {
			setMessage(`You submitted: ${answer}`);
			setConfirmed(true)
		}
		socket.on('submit_error', handleError)
		socket.on('submit_success', handleSuccess)
		return () => {
			socket.off('submit_error', handleError)
			socket.off('submit_success', handleSuccess)
		}
	}, [])

	//Selected Answer:----------------------------------------------------
	useEffect(() => {
		if (selectedAnswer) {
			setSelected(selectedAnswer);
			setConfirmed(true);
			setMessage(`You submitted: ${selectedAnswer}`);
		} else {
			setSelected(null);
			setConfirmed(false);
			setMessage('');
		}
	}, [selectedAnswer, question.id]);


	//Timer: ----------------------------------------------------
	const [remaining, setRemaining] = useState(0)
	useEffect(() => {
		if (!endsAt) return;

		const updateTimer = () => {
			const timeLeft = Math.max(0,
				Math.ceil((endsAt - Date.now()) / 1000)
			)
			setRemaining(timeLeft)
		}
		updateTimer()
		const interval = setInterval(updateTimer, 1000)

		return () => clearInterval(interval)
	}, [endsAt])



	//Functions: ----------------------------------------------------
	async function Leave() {
		const confirmation = await confirm('Are you sure you want to leave the quiz? ')
		if (!confirmation) return;
		socket.disconnect()
		sessionStorage.clear()
		navigate('/join', { replace: true })
	}

	function choose(option) {
		if (confirmed || status === 'revealed') return;
		setSelected(option);
	}

	function Submit() {
		if (!selected) return;
		setConfirmed(true)
		const roomCode = sessionStorage.getItem('roomCode')?.trim()
		if (!roomCode || !question) {
			socket.disconnect()
			sessionStorage.clear()
			return navigate('/join', { replace: true })
		}
		socket.emit('submit_answer', { roomCode, qid: question.id, answer: selected })
	}

	//Styles: ----------------------------------------------------
	const options = ['A', 'B', 'C', 'D']

	function optionClasses(option) {
		const isCorrect = status === 'revealed' && question.correct_option === option
		const isWrongPick = status === 'revealed' && selectedAnswer === option && question.correct_option !== option
		const isPicked = selected === option && status !== 'revealed'
		const disabled = confirmed || status === 'revealed'

		let tone = 'border-slate-700 hover:border-violet-500 hover:bg-violet-500/10'
		if (isCorrect) tone = 'border-emerald-500/50 bg-emerald-500/15 text-emerald-200'
		else if (isWrongPick) tone = 'border-rose-500/50 bg-rose-500/15 text-rose-200'
		else if (isPicked) tone = 'border-violet-500 bg-violet-500/15'

		return `flex items-center gap-3 rounded-xl border p-4 text-left transition ${tone} ${disabled ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'}`
	}

	return (
		<Shell>
			<div className="flex w-[90vw] max-w-sm flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<Button variant="danger" onClick={Leave}>Leave Quiz</Button>
				<div className="flex items-center gap-2">
					<Badge tone="accent">Score: {score}</Badge>
					<Badge tone={remaining > 0 ? 'neutral' : 'danger'}>
						{remaining > 0 ? `${remaining}s remaining` : "Time's up!"}
					</Badge>
				</div>
			</div>

			<Panel tone="solid" className="w-[90vw] max-w-sm">
				<div className="rounded-xl bg-violet-600/20 border border-violet-500/30 p-4 text-center font-bold">
					{question.question_text}
				</div>

				<div className="mt-4 flex flex-col gap-3">
					{options.map(option => (
						<button
							key={option}
							type="button"
							className={optionClasses(option)}
							onClick={() => choose(option)}
						>
							{status === 'revealed' && question.correct_option === option && <Tick />}
							{status === 'revealed' && selectedAnswer === option && question.correct_option !== option && <Cross />}
							<span>{question[`option_${option.toLowerCase()}`]}</span>
						</button>
					))}
				</div>

				{status === 'active' &&
					<Button
						variant="success"
						className="mt-4 w-full"
						onClick={Submit}
						disabled={confirmed}
					>
						Confirm
					</Button>
				}

				<div className="mt-4 text-center font-semibold text-slate-200">
					{status === 'revealed' ?
						selectedAnswer ?
							question.correct_option === selectedAnswer ? `Correct Answer! 🎉🎉` :
								`Uh oh! You submitted option ${selectedAnswer} but the correct option was ${question.correct_option}`
							: `You did not answer this question. Correct option is ${question.correct_option}` //If !selectedAnswer
						: message //--> If the status is not revealed
					}
				</div>
			</Panel>
		</Shell>
	)
}
export default Card
