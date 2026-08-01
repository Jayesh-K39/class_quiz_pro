import { useState, useEffect } from 'react'
import DeleteIcon from '../icons/delIcon'
import BackIcon from '../icons/BackIcon'
import EditIcon from '../icons/EditIcon'
import { useModal } from '../wrappers/ModalProvider'
import { toast } from 'react-hot-toast'
import Panel from './ui/Panel'
import Button from './ui/Button'
import IconButton from './ui/IconButton'
import Input from './ui/Input'

function Questions({ quiz, onBack }) {
	const { confirm, prompt } = useModal()
	const [form, setForm] = useState({ question_text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_option: 'A' })
	const [questions, setQuestions] = useState([])
	const [show, setShow] = useState(false)

	async function getQuestions() {
		const response = await fetch(`${import.meta.env.VITE_API_URL}/quizzes/${quiz.id}/questions`, {
			method: 'GET',
			headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
		})
		if (!response.ok) return;
		const data = await response.json()
		setQuestions(data.questions)
	}

	async function addQuestion(e) {
		e.preventDefault()
		try {
			const response = await fetch(`${import.meta.env.VITE_API_URL}/quizzes/${quiz.id}/questions`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
				body: JSON.stringify({
					question_text: form.question_text, option_a: form.option_a, option_b: form.option_b,
					option_c: form.option_c, option_d: form.option_d, correct_option: form.correct_option
				})
			})
			const data = await response.json()
			if (data.error) return toast.error(data.error);
			await getQuestions()
			setForm({ question_text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_option: 'A' })
			setShow(false)
		}
		catch (err) { console.log(err) }
	}

	async function deleteQuestion(id, title) {
		const confirmation = await confirm(`Are you sure you want to delete this question: '${title}' ?`)
		if (!confirmation) return;
		const response = await fetch(`${import.meta.env.VITE_API_URL}/questions/${id}`, {
			method: 'DELETE',
			headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
		})
		if (!response.ok) return;
		getQuestions()
	}

	async function editQuestion(id) {
		const question = questions.find(q => q.id === id)
		const update = await prompt('Enter the updated question title here: ', question.question_text)
		if (!update?.trim()) return
		const response = await fetch(`${import.meta.env.VITE_API_URL}/questions/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
			body: JSON.stringify({ update })
		})
		if (!response.ok) return;
		getQuestions()
	}

	function handler(e) { setForm({ ...form, [e.target.name]: e.target.value }) }
	useEffect(() => { getQuestions() }, [])

	return (
		<Panel tone="solid" className="flex max-h-[80vh] w-[90vw] max-w-2xl flex-col gap-3">
			<div className="relative text-center font-bold">
				{quiz.title}
				<button onClick={onBack} className="absolute left-0 top-0 cursor-pointer text-slate-400 hover:text-white"><BackIcon /></button>
			</div>

			<div className="flex flex-col gap-2 overflow-y-auto">
				{questions.map((question, index) => (
					<div key={question.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
						<span className="font-bold text-slate-400">Q{index + 1}.</span>
						<span className="min-w-0 flex-1 break-words">{question.question_text}</span>
						<IconButton tone="danger" onClick={() => deleteQuestion(question.id, question.question_text)}>
							<DeleteIcon />
						</IconButton>

						<IconButton tone="accent" onClick={() => editQuestion(question.id)}>
							<EditIcon />
						</IconButton>
					</div>
				))}
			</div>

			<Button className="w-full" onClick={() => { setShow(true) }}>+ Add a new question</Button>

			{show && (
				<div className="fixed inset-0 flex items-center justify-center bg-black/60 p-4">
					<Panel tone="solid" className="relative flex w-[90vw] max-w-lg flex-col gap-3">
						<form className="flex flex-col gap-3"
							onSubmit={async (e) => await addQuestion(e)}>
							<button onClick={() => setShow(false)} className="absolute left-6 top-6 cursor-pointer text-slate-400 hover:text-white" type="button">
								<BackIcon />
							</button>

							<div className="text-center font-bold">Adding a new question</div>

							<Input value={form.question_text} name="question_text" placeholder="Enter question text here" required onChange={handler} />

							<Input value={form.option_a} name="option_a" placeholder="Enter option A" required
								onChange={handler} />

							<Input value={form.option_b} name="option_b" placeholder="Enter option B" required
								onChange={handler} />

							<Input value={form.option_c} name="option_c" placeholder="Enter option C" required
								onChange={handler} />

							<Input value={form.option_d} name="option_d" placeholder="Enter option D" required
								onChange={handler} />

							<div className="flex items-center justify-between gap-3 p-1">
								<label htmlFor="selector" className="text-sm text-slate-300">Select the correct option here:</label>
								<select id="selector" name="correct_option" className="rounded-lg border border-slate-700 bg-slate-950/50 p-2 outline-none" value={form.correct_option} onChange={handler} required>
									<option value="A">A</option>
									<option value="B">B</option>
									<option value="C">C</option>
									<option value="D">D</option>
								</select>
							</div>

							<Button type="submit" className="w-full">Done</Button>
						</form>
					</Panel>
				</div>
			)}
		</Panel>
	)
}
export default Questions
