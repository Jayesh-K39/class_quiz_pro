import {useNavigate} from 'react-router-dom'
import {socket} from '../socket.js'

function Waiting(){
	const navigate = useNavigate()
	const end = () =>{
		const confirmation = confirm('Are you sure you want to leave the quiz?')
		if(!confirmation)return;
		socket.disconnect()
		sessionStorage.clear()
		navigate('/join', {replace:true})
	}

	return(
		<div className='bg-[#ca38cf] min-h-screen p-6 flex flex-col gap-4 
		items-center justify-center'>
			<div className='text-center font-bold text-white text-[2rem] w-[90vw] p-3 max-w-lg rounded-md '>
				Waiting for the quiz to start...
			</div>
			<button onClick={end} className={`bg-red-500 text-white font-bold cursor-pointer p-3 rounded-lg text-[1.5rem] hover:bg-red-600`}>Leave Quiz</button>
		</div>
	)
}
export default Waiting
