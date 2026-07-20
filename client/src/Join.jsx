import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {socket} from './socket.js'
import {toast} from 'react-hot-toast'
import EyeIcon from './icons/Eye'
import EyeSlash from './icons/EyeSlash'

function Join(){
	const navigate = useNavigate()
	useEffect(()=>{
		const roomCode = sessionStorage.getItem('roomCode')
		const name = sessionStorage.getItem('name')
		const studentId = sessionStorage.getItem('studentId')
		
		if( roomCode && name && studentId) return navigate('/student', {replace:true})

		const handleError = ({error}) =>{
			toast.error(error)
			socket.off('session_not_found')
		}
		socket.on('session_error', handleError)
		document.title = 'Class Quiz Pro | Student Joining'

		return()=>{
			socket.off('session_error', handleError)
		}
	}, [])

	const bodyStyle = `min-h-screen bg-[#4c1d95] flex flex-col items-center justify-center gap-4`
	const holderStyle = `bg-white flex flex-col gap-4 rounded-xl p-6 w-[90vw] max-w-lg`
	const inputStyle = ` outline-none p-3 h-1/5 flex-1`
	const btnStyle = `w-full bg-green-500 hover:bg-green-600 rounded-lg p-3 cursor-pointer`
	const [name,setName] = useState('')
	const [roomCode, setCode] = useState('')
	const [show, setShow] = useState(false)

	function joinRoom(e){
		e.preventDefault()
		socket.connect()
		socket.once('connect_error', (err)=>{
			console.log(err.message)
			toast.error('Server Error. Please standby...')
		})
		socket.once('session_not_found', ()=>{
			socket.disconnect()
			toast.error(`No active session found with room code ${roomCode}`)
		})

		socket.once('join_success', (data)=>{
			sessionStorage.setItem('roomCode', roomCode)
			sessionStorage.setItem('name', name)
			sessionStorage.setItem('studentId', data.studentId)
			navigate('/student', {replace:true})		
		})
		socket.emit('join_room', {roomCode, name})
	}
	return(
	<div className={bodyStyle}>
		<form className={holderStyle} onSubmit={e=>joinRoom(e)}>
			<div className='text-center font-bold'>Student Login</div>
	
				<input name='email'
				type='text'
				value={name} 
				autoComplete='on' 
				required
				onChange={e=>setName(e.target.value)}
				placeholder='Enter your name here: ' 
				className={inputStyle} 
				/>
	

				<div className='flex items-center'>
					<input name='roomcode' 
					value={roomCode}
					type={show ? 'text': 'password'}
					autoComplete='on'
					required
					onChange={e=>setCode(e.target.value)}
					placeholder='Enter a valid room code: '
					className={inputStyle} 
					/>

					<button type='button' className='p-2 cursor-pointer' onClick={()=>setShow(s => !s)}>
						{roomCode ? show ? <EyeIcon/> : <EyeSlash/> : null}
					</button>
				</div>
		
				<button type='submit' className={btnStyle}>Join</button>
		</form>
	
	</div>
	)
}

export default Join
