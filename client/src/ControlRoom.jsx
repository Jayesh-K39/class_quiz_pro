import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import UserIcon from './icons/UserIcon'
import QuizList from './components/QuizList'
import Questions from './components/Questions'
import LogOut from './components/LogOutModal'
import { toast } from 'react-hot-toast'
import { useModal } from './wrappers/ModalProvider'
import { jwtDecode } from 'jwt-decode'
import Shell from './components/ui/Shell'
import IconButton from './components/ui/IconButton'

function ControlRoom() {
	const { confirm } = useModal()
	const navigate = useNavigate()
	const [selectedQuiz, setSelectedQuiz] = useState(null)
	const [modal, setModal] = useState(false)

	useEffect(() => {
		if (sessionStorage.getItem('roomCode')?.trim()) return navigate('/session', { replace: true })
		document.title = 'Class Quiz Pro | Teacher Control Room'
	}, [selectedQuiz])

	async function logout() {
		const confirmation = await confirm(`Are you sure you want to log out of your teacher account?`)
		if (!confirmation) return;
		sessionStorage.clear()
		localStorage.clear()
		navigate('/', { replace: true })
	}

	async function handleDelete() {
		const confirmation = await confirm(`Are you sure you want to delete this account? This action is permanent and will result into deletion of your entire app data of this account.`)
		if (!confirmation) return;
		const response = await fetch(`${import.meta.env.VITE_API_URL}/`, {
			method: 'DELETE',
			headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
		})
		if (!response.ok) return toast.error('Some error occured...')
		toast.success('Account deleted')
		sessionStorage.clear()
		localStorage.clear()
		navigate('/', { replace: true })
	}
	const token = localStorage.getItem('token')
	const email = token ? jwtDecode(token).email : ''
	return (
		<Shell className="relative">
			<IconButton className="absolute top-5 right-5 bg-white/5 border border-white/10" onClick={() => setModal(true)}>
				<UserIcon />
			</IconButton>

			{selectedQuiz ? <Questions quiz={selectedQuiz} onBack={() => setSelectedQuiz(null)} /> : <QuizList onSelect={setSelectedQuiz} />}

			{modal && <LogOut setModal={setModal} logout={logout}
				Delete={handleDelete} email={email} />}
		</Shell>
	)
}
export default ControlRoom
