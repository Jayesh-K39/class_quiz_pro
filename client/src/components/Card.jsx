import {socket} from '../socket.js'
import {useNavigate} from 'react-router-dom'
import {useState, useEffect} from 'react'
import Tick from '../icons/Tick'
import {useModal} from '../wrappers/ModalProvider'
import Cross from '../icons/Cross'

function Card({question, endsAt, status, selectedAnswer, score}){

//States: ----------------------------------------------------
	const navigate = useNavigate()
	const {confirm, prompt} = useModal()
	const [confirmed, setConfirmed] = useState(false)
	const [message, setMessage] = useState('')
	const [selected, setSelected] = useState(null)

//Socket listeners regarding submission----------------------------------------------------
	useEffect(()=>{	
		const handleError = ({message}) =>{setMessage(message)}
		const handleSuccess = ({answer}) => { 
			setMessage(`You submitted: ${answer}`); 
			setConfirmed(true)
		}
		socket.on('submit_error', handleError)
		socket.on('submit_success', handleSuccess)
		return()=>{
			socket.off('submit_error', handleError)
			socket.off('submit_success', handleSuccess)
		}
	},[])

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
	useEffect(()=>{
		if(!endsAt)return;

		const updateTimer = () => {
			const timeLeft = Math.max(0,  
			Math.ceil( (endsAt - Date.now() )/1000  )
			)
			setRemaining(timeLeft)
		}
		updateTimer()
		const interval = setInterval(updateTimer, 1000)

		return ()=> clearInterval(interval)
	}, [endsAt])



//Functions: ----------------------------------------------------
	async function Leave(){
		const confirmation = await confirm('Are you sure you want to leave the quiz? ')
		if(!confirmation)return;
		socket.disconnect()
		sessionStorage.clear()
		navigate('/join', {replace:true})
	}

	function choose(option){
	    if(confirmed || status === 'revealed') return;
	    setSelected(option);
	}

	function Submit(){
		if(!selected)return;
		setConfirmed(true)
		const roomCode = sessionStorage.getItem('roomCode')
		if(!roomCode || !question){
			socket.disconnect()
			sessionStorage.clear()
			return navigate('/join', {replace:true})
		}
		socket.emit('submit_question', {roomCode, qid:question.id, answer:selected})
	}

//Styles: ----------------------------------------------------
	const bodyStyle = `min-h-screen bg-[#4c1d95] p-6 flex flex-col `
	const questionBox = `rounded-md bg-[#4c1d95] p-3 w-full text-center text-white font-bold`
	const card = `bg-white rounded-md p-3 w-[80vw] max-w-sm flex flex-col gap-2 mx-auto my-4`
	const upperDiv = `text-center w-[80vw] max-w-sm flex flex-col sm:flex-row justify-center sm:items-center self-center gap-3 p-3`
	const optionDiv = `border rounded-md p-3 `
	const btnStyle = `cursor-pointer bg-red-500 p-3 rounded-md hover:bg-red-600 font-bold text-white`	 
	const helper = `w-[80vw] max-w-sm p-3 rounded-md block mx-auto`
	const options = ['A', 'B', 'C', 'D']

//UI: ----------------------------------------------------
	return(
		<div className={bodyStyle}>
			<div className={upperDiv}>
				<button className={btnStyle} onClick={Leave}>Leave Quiz</button>
				<span className='font-bold bg-white p-3 rounded-md '>Score: {score}</span>
				<span className='font-bold bg-white p-3 rounded-md'>
					{remaining > 0 ? `${remaining} seconds remaining` : "Time's up!"}
				</span>
			</div>

			<div className={card}>
				<div className={questionBox}>{question.question_text}</div>

				{options.map(option=>(
					<div key={option} className={`${optionDiv}
						${selected === option ? 'bg-blue-300' : ''}
						${confirmed || status === 'revealed' ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
						${status === 'revealed' && question.correct_option===option ? 'bg-green-300 opacity-100' : ''}
						${status === 'revealed' && selectedAnswer === option && question.correct_option!==option? 'bg-red-300 opacity-100' : ''}`}
						onClick={()=>choose(option)}>
							{ question[`option_${option.toLowerCase()}`] } 
					</div>
				))}
			</div>


				{status === 'active'  && 
				<button className={`${helper} ${confirmed && selected ? 'opacity-70 bg-gray-200 cursor-not-allowed' : 'bg-green-400 hover:bg-green-500 cursor-pointer'}`} onClick={Submit} 
				disabled={confirmed}>Confirm</button>
				}

				
				 <div className='font-bold text-center text-white mt-3'>
				 	
				 	{status === 'revealed' ?

				 	selectedAnswer ? 
				 	question.correct_option === selectedAnswer ? `Correct Answer! 🎉🎉` : 
				 	`Uh oh! You submitted option ${selectedAnswer} but he correct option was ${question.correct_option}`

				 	: `You did not answer this question. Correct option is ${question.correct_option}` //If !selectedAnswer

				 	: message //--> If the status is not revealed

				 	}
				 </div>
		</div>
	)
} 
export default Card
