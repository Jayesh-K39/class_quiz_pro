import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import ExitIcon from './icons/ExitIcon'
import QuizList from './components/QuizList'
import Questions from './components/Questions'
import {useModal} from './wrappers/ModalProvider'

function ControlRoom(){
	const {confirm, prompt} = useModal()
	const navigate = useNavigate()
	const [selectedQuiz, setSelectedQuiz] = useState(null)
	const bodyStyle = `min-h-screen bg-[#ca38cf] flex flex-col justify-center items-center relative`
	const btnStyle = `p-1 font-bold absolute top-2 right-2 cursor-pointer bg-white rounded-md`

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
	return(
		<div className={bodyStyle}>
			<button className={btnStyle} onClick={logout}><ExitIcon/></button>
			{selectedQuiz ? <Questions quiz={selectedQuiz} onBack={()=>setSelectedQuiz(null)}/> : <QuizList onSelect={setSelectedQuiz}/>}
		</div>
	)
}
export default ControlRoom
