import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import EyeIcon from './icons/Eye'
import EyeSlash from './icons/EyeSlash'
import Shell from './components/ui/Shell'
import Panel from './components/ui/Panel'
import Input from './components/ui/Input'
import Button from './components/ui/Button'

function Login() {
	const navigate = useNavigate()
	useEffect(() => {
		document.title = 'Class Quiz Pro | Teacher Login'
	}, [])

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [show, setShow] = useState(false)

	async function login(e) {
		e.preventDefault()
		try {
			const response = await fetch(`${import.meta.env.VITE_API_URL}/login`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ email, password })
				})
			const data = await response.json()
			if (data.error) {
				toast.error(data.error)
				return
			}
			localStorage.setItem('token', data.token)
			navigate('/controlroom', { replace: true })
		}
		catch {
			toast.error("Server Error.Please Stand By...")
		}
	}
	return (
		<Shell>
			<Panel tone="solid" className="w-[90vw] max-w-md">
				<form className="flex flex-col gap-4" onSubmit={async e => await login(e)}>
					<div className="text-center font-bold text-lg">Login</div>

					<Input
						name="email"
						value={email}
						type="email"
						autoComplete="email"
						required
						onChange={e => setEmail(e.target.value)}
						placeholder="Enter your e-mail ID here"
					/>

					<Input
						name="password"
						value={password}
						type={show ? 'text' : 'password'}
						autoComplete="current-password"
						required
						onChange={e => setPassword(e.target.value)}
						placeholder="Enter the password for this app"
						trailing={
							<button type="button" className="cursor-pointer p-2 text-slate-400 hover:text-white" onClick={() => setShow(s => !s)}>
								{password ? show ? <EyeIcon /> : <EyeSlash /> : null}
							</button>
						}
					/>

					<Button type="submit" className="w-full">Enter</Button>
				</form>
			</Panel>
		</Shell>
	)
}

export default Login
