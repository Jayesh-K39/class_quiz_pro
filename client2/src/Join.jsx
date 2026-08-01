import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { socket } from './socket.js'
import { toast } from 'react-hot-toast'
import EyeIcon from './icons/Eye'
import EyeSlash from './icons/EyeSlash'
import Shell from './components/ui/Shell'
import Panel from './components/ui/Panel'
import Input from './components/ui/Input'
import Button from './components/ui/Button'

function Join() {
	const navigate = useNavigate()
	useEffect(() => {
		const roomCode = sessionStorage.getItem('roomCode')?.trim()
		const name = sessionStorage.getItem('name')?.trim()
		const studentId = sessionStorage.getItem('studentId')?.trim()

		if (roomCode && name && studentId) return navigate('/student', { replace: true })

		const handleError = ({ error }) => {
			toast.error(error)
			socket.off('session_not_found')
		}
		socket.on('session_error', handleError)
		document.title = 'Class Quiz Pro | Student Joining'

		return () => {
			socket.off('session_error', handleError)
		}
	}, [])

	const [name, setName] = useState('')
	const [roomCode, setCode] = useState('')
	const [show, setShow] = useState(false)

	function joinRoom(e) {
		e.preventDefault()
		socket.connect()
		socket.once('connect_error', (err) => {
			console.log(err.message)
			toast.error('Server Error. Please standby...')
		})
		socket.once('session_not_found', () => {
			socket.disconnect()
			toast.error(`No active session found with room code ${roomCode}`)
		})

		socket.once('join_success', (data) => {
			sessionStorage.setItem('roomCode', roomCode?.trim())
			sessionStorage.setItem('name', name?.trim())
			sessionStorage.setItem('studentId', (data.studentId)?.trim())
			navigate('/student', { replace: true })
		})
		socket.emit('join_room', { roomCode: roomCode.trim(), name })
	}
	return (
		<Shell>
			<Panel tone="solid" className="w-[90vw] max-w-md">
				<form className="flex flex-col gap-4" onSubmit={e => joinRoom(e)}>
					<div className="text-center font-bold text-lg">Student Login</div>

					<Input
						name="student_name"
						type="text"
						value={name}
						autoComplete="off"
						required
						onChange={e => setName(e.target.value)}
						placeholder="Enter your name here"
					/>

					<Input
						name="roomcode"
						value={roomCode}
						type={show ? 'text' : 'password'}
						autoComplete="off"
						required
						onChange={e => setCode(e.target.value)}
						placeholder="Enter a valid room code"
						trailing={
							<button type="button" className="cursor-pointer p-2 text-slate-400 hover:text-white" onClick={() => setShow(s => !s)}>
								{roomCode ? show ? <EyeIcon /> : <EyeSlash /> : null}
							</button>
						}
					/>

					<Button type="submit" className="w-full">Join</Button>
				</form>
			</Panel>
		</Shell>
	)
}

export default Join
