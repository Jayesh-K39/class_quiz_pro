import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import ExitIcon from './icons/ExitIcon'
import UserIcon from './icons/UserIcon'
import QuizList from './components/QuizList'
import Questions from './components/Questions'
import LogOut from './components/LogOutModal'
import {useModal} from './wrappers/ModalProvider'
import {jwtDecode} from 'jwt-decode'

function ControlRoom(){
	const {confirm, prompt} = useModal()
	const navigate = useNavigate()
	const [selectedQuiz, setSelectedQuiz] = useState(null)
	const [modal, setModal] = useState(false)
	const bodyStyle = `min-h-screen bg-[#4c1d95] flex flex-col justify-center items-center relative`
	const btnStyle = `p-1 rounded-full absolute top-5 right-5 cursor-pointer bg-white`

	useEffect(()=>{
		if(sessionStorage.getItem('roomCode'))return navigate('/session', {replace:true})
		document.title ='Class Quiz Pro | Teacher Control Room'
	}, [selectedQuiz])

	async function logout(){
		const confirmation = await confirm(`Are you sure you want to log out of your teacher account?`)
		if(!confirmation)return;
		sessionStorage.clear()
		localStorage.clear()
		navigate('/', {replace:true})
		
	}
	const token = localStorage.getItem('token')
	const email = token ? jwtDecode(token).email : ''
	return(
		<div className={bodyStyle}>
			<button className={btnStyle} onClick={()=>setModal(true)}><UserIcon/></button>
			{selectedQuiz ? <Questions quiz={selectedQuiz} onBack={()=>setSelectedQuiz(null)}/> : <QuizList onSelect={setSelectedQuiz}/>}

			{modal && <LogOut setModal={setModal} logout={logout} email={email}/>}
		</div>
	)
}
export default ControlRoom
